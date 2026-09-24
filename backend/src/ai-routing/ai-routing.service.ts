import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Problem, ProblemCategory, ProblemStatus } from '../problems/problem.entity';
import { Institution } from '../institutions/institution.entity';
import {
  AIRoutingResult,
  CategoryClassificationResult,
  DuplicateCandidateResult,
  SuggestedInstitutionMatch,
} from './ai-routing.interface';
import { EmbeddingService, EMBEDDING_DIMENSION } from './embedding.service';
import { THEME_REFERENCE_PHRASES } from './reference-themes.data';

@Injectable()
export class AiRoutingService implements OnModuleInit {
  private readonly logger = new Logger(AiRoutingService.name);

  /** Cached centroid vectors for each problem theme */
  private themeCentroids: Map<ProblemCategory, number[]> = new Map();
  private isInitialized = false;

  constructor(
    @InjectRepository(Problem) private readonly problemRepo: Repository<Problem>,
    @InjectRepository(Institution) private readonly institutionRepo: Repository<Institution>,
    private readonly dataSource: DataSource,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async onModuleInit() {
    await this.initThemeCentroids();
  }

  /**
   * Embeds reference phrases once at startup and computes theme centroid vectors.
   */
  async initThemeCentroids(): Promise<void> {
    if (this.isInitialized) return;
    this.logger.log('🧠 Computing theme centroid embeddings from reference datasets...');

    try {
      for (const [categoryKey, phrases] of Object.entries(THEME_REFERENCE_PHRASES)) {
        const category = categoryKey as ProblemCategory;
        const phraseEmbeddings = await this.embeddingService.embedBatch(phrases as string[]);

        // Compute centroid: mean of all phrase embedding vectors
        const centroid = new Array(EMBEDDING_DIMENSION).fill(0);
        for (const emb of phraseEmbeddings) {
          for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
            centroid[i] += emb[i];
          }
        }

        // Divide by N and normalize centroid to unit length
        const n = phraseEmbeddings.length;
        for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
          centroid[i] /= n;
        }

        const normalizedCentroid = this.embeddingService.normalizeVector(centroid);
        this.themeCentroids.set(category, normalizedCentroid);
      }

      this.isInitialized = true;
      this.logger.log(`✅ Pre-computed ${this.themeCentroids.size} theme centroids successfully.`);
    } catch (err) {
      this.logger.error(`Failed to initialize theme centroids: ${(err as Error).message}`);
    }
  }

  /**
   * Real embedding-based classification step:
   * Computes cosine similarity of input text embedding to each theme centroid vector.
   * Returns top category + confidence score.
   */
  async classifyCategory(text: string): Promise<CategoryClassificationResult> {
    if (!this.isInitialized || this.themeCentroids.size === 0) {
      await this.initThemeCentroids();
    }

    const queryEmbedding = await this.embeddingService.embedText(text);
    const scores: Record<string, number> = {};

    let bestCategory = ProblemCategory.OTHER;
    let maxSimilarity = -1;

    for (const [category, centroid] of this.themeCentroids.entries()) {
      const similarity = this.embeddingService.cosineSimilarity(queryEmbedding, centroid);
      scores[category] = Math.round(similarity * 1000) / 1000;

      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        bestCategory = category;
      }
    }

    // Confidence calculation: top cosine similarity combined with margin to second-best category
    const sortedScores = Object.values(scores).sort((a, b) => b - a);
    const topScore = sortedScores[0] ?? 0;
    const secondScore = sortedScores[1] ?? 0;
    const margin = Math.max(0, topScore - secondScore);
    const rawConfidence = Math.min(0.98, Math.max(0.45, (topScore + margin * 1.5)));
    const confidence = Math.round(rawConfidence * 100) / 100;

    return {
      category: bestCategory,
      confidence,
      scores,
    };
  }

  /**
   * Main routing entry point — called by BullMQ processor.
   */
  async routeProblem(problemId: string): Promise<AIRoutingResult> {
    const problem = await this.problemRepo.findOne({ where: { id: problemId } });
    if (!problem) throw new Error(`Problem ${problemId} not found`);

    const text = `${problem.title}\n${problem.description}`;

    // 1. Generate dense embedding
    const embedding = await this.embeddingService.embedText(text);

    // 2. Classify theme
    const { category, confidence } = await this.classifyCategory(text);

    // 3. Compute priority score
    const priorityScore = this.computePriority(problem);

    // 4. Find duplicate candidates
    const duplicates = await this.findDuplicates(problemId, embedding, {
      district: problem.district ?? undefined,
      threshold: 0.85,
    });
    const duplicateCandidateIds = duplicates.map((d) => d.id);

    // 5. Suggest institutions
    const suggestedInstitutions = await this.suggestInstitutions(category, problem.district);
    const suggestedInstitutionIds = suggestedInstitutions.map((i) => i.institutionId);

    // 6. Store embedding vector in PostgreSQL pgvector column
    try {
      const vectorStr = `[${embedding.join(',')}]`;
      await this.dataSource.query(
        `UPDATE problems SET embedding = $1::vector WHERE id = $2`,
        [vectorStr, problemId],
      );
    } catch (err) {
      this.logger.warn(`Could not save raw pgvector directly: ${(err as Error).message}`);
    }

    this.logger.log(
      `AI Routing for ${problemId}: category=${category} (conf=${confidence}), priority=${priorityScore}, duplicates=${duplicateCandidateIds.length}`,
    );

    return {
      category,
      confidence,
      priorityScore,
      duplicateCandidateIds,
      suggestedInstitutionIds,
      suggestedInstitutionsExplained: suggestedInstitutions,
    };
  }

  /**
   * DUPLICATE DETECTION:
   * Queries pgvector for top 5 nearest existing OPEN problems within geo-radius (PostGIS ST_DWithin)
   * whose cosine similarity exceeds the threshold (default 0.85).
   */
  async findDuplicates(
    excludeProblemId: string | null,
    queryEmbedding: number[],
    options: {
      latitude?: number;
      longitude?: number;
      radiusKm?: number;
      threshold?: number;
      district?: string;
    } = {},
  ): Promise<DuplicateCandidateResult[]> {
    const threshold = options.threshold ?? 0.85;
    const radiusMeters = (options.radiusKm ?? 50) * 1000;
    const vectorStr = `[${queryEmbedding.join(',')}]`;

    try {
      // Primary query using native pgvector cosine operator `<=>` and PostGIS ST_DWithin
      let query = `
        SELECT 
          p.id, 
          p.title, 
          p.description, 
          p.category, 
          p.status, 
          p.upvotes, 
          p.district, 
          p.village, 
          p.media,
          p."createdAt",
          1 - (p.embedding <=> $1::vector) AS similarity,
          CASE 
            WHEN p.location IS NOT NULL AND $2::float IS NOT NULL AND $3::float IS NOT NULL
            THEN ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint($3, $2), 4326)::geography) / 1000.0
            ELSE NULL 
          END AS distance_km
        FROM problems p
        WHERE p.embedding IS NOT NULL
          AND p.duplicate_of_id IS NULL
          AND p.status NOT IN ('resolved', 'rejected')
      `;

      const params: any[] = [vectorStr, options.latitude ?? null, options.longitude ?? null];
      let paramIdx = 4;

      if (excludeProblemId) {
        query += ` AND p.id != $${paramIdx++}`;
        params.push(excludeProblemId);
      }

      // Geo-spatial filtering if coordinates provided
      if (options.latitude != null && options.longitude != null) {
        query += ` AND (p.location IS NULL OR ST_DWithin(p.location::geography, ST_SetSRID(ST_MakePoint($3, $2), 4326)::geography, $${paramIdx++}))`;
        params.push(radiusMeters);
      } else if (options.district) {
        query += ` AND (p.district ILIKE $${paramIdx++} OR p.district IS NULL)`;
        params.push(`%${options.district}%`);
      }

      query += ` AND (1 - (p.embedding <=> $1::vector)) >= $${paramIdx++}`;
      params.push(threshold);

      query += ` ORDER BY similarity DESC LIMIT 5`;

      const results = await this.dataSource.query(query, params);

      return results.map((r: any) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.category as ProblemCategory,
        status: r.status as ProblemStatus,
        similarity: Math.round(parseFloat(r.similarity) * 1000) / 1000,
        distanceKm: r.distance_km != null ? Math.round(parseFloat(r.distance_km) * 10) / 10 : null,
        upvotes: parseInt(r.upvotes || '0', 10),
        district: r.district,
        village: r.village,
        media: r.media || [],
        createdAt: r.createdAt,
      }));
    } catch (err) {
      this.logger.warn(`pgvector query fallback invoked: ${(err as Error).message}`);
      return this.findDuplicatesFallback(excludeProblemId, queryEmbedding, options);
    }
  }

  /**
   * Resilient fallback in case database lacks vector extension or running in offline tests.
   */
  private async findDuplicatesFallback(
    excludeProblemId: string | null,
    queryEmbedding: number[],
    options: {
      latitude?: number;
      longitude?: number;
      radiusKm?: number;
      threshold?: number;
      district?: string;
    },
  ): Promise<DuplicateCandidateResult[]> {
    const threshold = options.threshold ?? 0.85;
    try {
      const qb = this.problemRepo
        .createQueryBuilder('p')
        .where('p.duplicateOfId IS NULL')
        .andWhere('p.status NOT IN (:...closedStatuses)', {
          closedStatuses: [ProblemStatus.RESOLVED, ProblemStatus.REJECTED],
        });

      if (excludeProblemId) {
        qb.andWhere('p.id != :id', { id: excludeProblemId });
      }

      const openProblems = await qb.take(50).getMany();
      const scored: DuplicateCandidateResult[] = [];

      for (const p of openProblems) {
        // Embed problem text on the fly if stored embedding is not available
        const pEmbedding = p.embedding || (await this.embeddingService.embedText(`${p.title}\n${p.description}`));
        const similarity = this.embeddingService.cosineSimilarity(queryEmbedding, pEmbedding);

        if (similarity >= threshold) {
          scored.push({
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            status: p.status,
            similarity: Math.round(similarity * 1000) / 1000,
            distanceKm: null,
            upvotes: p.upvotes,
            district: p.district,
            village: p.village,
            media: p.media,
            createdAt: p.createdAt?.toISOString(),
          });
        }
      }

      scored.sort((a, b) => b.similarity - a.similarity);
      return scored.slice(0, 5);
    } catch {
      return [];
    }
  }

  /**
   * PRIORITY SCORING — weighted formula.
   * Formula: (upvotes * 0.3) + (recencyScore * 0.3) + (textUrgency * 0.4)
   */
  computePriority(problem: Problem): number {
    const upvoteScore = Math.min(problem.upvotes * 2, 30); // max 30pts
    const ageHours = (Date.now() - new Date(problem.createdAt || Date.now()).getTime()) / 3600000;
    const recencyScore = Math.max(0, 30 - ageHours * 0.1); // decays over 300h

    const urgentKeywords = [
      'urgent', 'emergency', 'critical', 'fatal', 'death', 'crisis', 'immediate',
      'hazard', 'danger', 'outbreak', 'poison', 'collapse',
      'जरूरी', 'आपातकाल', 'खतरा', 'मौत', 'जहर', 'गंभीर', 'तबाही'
    ];
    const text = `${problem.title} ${problem.description}`.toLowerCase();
    const urgencyMatches = urgentKeywords.filter((k) => text.includes(k)).length;
    const textUrgency = Math.min(urgencyMatches * 10, 40); // max 40pts

    return Math.min(100, Math.round(upvoteScore + recencyScore + textUrgency));
  }

  /**
   * Helper to compute matchedOn tags by intersecting institution's
   * researchAreas + domainTags + incubationCells with the category's tag list.
   */
  intersectTags(
    institution: Pick<Institution, 'researchAreas' | 'domainTags' | 'incubationCells'>,
    categoryTags: string[],
  ): string[] {
    const combined = [
      ...(institution.researchAreas || []),
      ...(institution.domainTags || []),
      ...(institution.incubationCells || []),
    ];

    const matched: string[] = [];
    const seen = new Set<string>();

    for (const tag of combined) {
      if (!tag) continue;
      const trimmedTag = tag.trim();
      const normTag = trimmedTag.toLowerCase();
      if (seen.has(normTag)) continue;

      const isMatch = categoryTags.some((cTag) => {
        const normCat = cTag.trim().toLowerCase();
        return (
          normTag === normCat ||
          normTag.includes(normCat) ||
          normCat.includes(normTag)
        );
      });

      if (isMatch) {
        seen.add(normTag);
        matched.push(trimmedTag);
      }
    }

    return matched;
  }

  /**
   * INSTITUTION MATCHING — domain tag & incubation cell overlap with category.
   * Matches Institution.researchAreas / domainTags / incubationCells against category tags.
   * Returns { institutionId, institutionName, matchedOn: string[] }
   */
  async suggestInstitutions(
    category: ProblemCategory,
    district?: string | null,
  ): Promise<SuggestedInstitutionMatch[]> {
    const categoryToTags: Partial<Record<ProblemCategory, string[]>> = {
      [ProblemCategory.WATER]: [
        'water',
        'Water Resource Research',
        'water resources',
        'civil engineering',
        'environmental',
        'hydrology',
      ],
      [ProblemCategory.AGRICULTURE]: [
        'agriculture',
        'agritech',
        'AgriTech Incubation Cell',
        'food tech',
        'biotechnology',
        'rural tech',
        'Rural Technology Centre',
      ],
      [ProblemCategory.HEALTHCARE]: [
        'biomedical',
        'pharmacy',
        'public health',
        'healthcare',
        'pharmaceutical sciences',
        'medical devices',
      ],
      [ProblemCategory.EDUCATION]: [
        'education',
        'social science',
        'psychology',
        'edtech',
        'IT',
      ],
      [ProblemCategory.ENVIRONMENT]: [
        'environmental',
        'environment',
        'chemistry',
        'ecology',
        'waste management',
        'clean tech',
      ],
      [ProblemCategory.ROADS]: [
        'civil engineering',
        'transportation',
        'urban planning',
        'roads',
        'infrastructure',
      ],
      [ProblemCategory.URBAN_INFRA]: [
        'electrical',
        'civil engineering',
        'urban planning',
        'smart city',
        'energy',
      ],
      [ProblemCategory.ACCESSIBILITY]: [
        'assistive technology',
        'biomedical',
        'civil engineering',
        'accessibility',
      ],
      [ProblemCategory.LIVELIHOOD]: [
        'management',
        'economics',
        'entrepreneurship',
        'Technology Business Incubator (TBI)',
        'Startup Hub ISM',
        'BIT Mesra Innovation Centre',
        'E-Cell',
      ],
    };

    const tags = categoryToTags[category] || ['engineering', 'technology'];

    try {
      const qb = this.institutionRepo.createQueryBuilder('i');
      const results = await qb
        .where(
          'i.researchAreas && :tags OR i.domainTags && :tags OR i.incubationCells && :tags',
          { tags },
        )
        .orderBy('i.problemsResolved', 'DESC')
        .take(3)
        .getMany();

      if (!results || results.length === 0) {
        const all = await this.institutionRepo.find({ take: 3 });
        return (all || []).map((i) => ({
          institutionId: i.id,
          institutionName: i.name,
          matchedOn: this.intersectTags(i, tags),
        }));
      }

      return results.map((i) => ({
        institutionId: i.id,
        institutionName: i.name,
        matchedOn: this.intersectTags(i, tags),
      }));
    } catch (err) {
      this.logger.warn(`suggestInstitutions query fallback: ${(err as Error).message}`);
      return [];
    }
  }
}
