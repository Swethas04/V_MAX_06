import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Problem, ProblemStatus, ProblemCategory, SubmitterType } from './problem.entity';
import { CreateProblemDto, ProblemsQueryDto, CheckSimilarDto } from './dto/problem.dto';
import { EmbeddingService } from '../ai-routing/embedding.service';
import { AiRoutingService } from '../ai-routing/ai-routing.service';
import { DuplicateCandidateResult } from '../ai-routing/ai-routing.interface';

export const AI_ROUTING_QUEUE = 'ai-routing';

@Injectable()
export class ProblemsService {
  private readonly logger = new Logger(ProblemsService.name);

  constructor(
    @InjectRepository(Problem) private readonly repo: Repository<Problem>,
    @InjectQueue(AI_ROUTING_QUEUE) private readonly aiQueue: Queue,
    private readonly dataSource: DataSource,
    private readonly embeddingService: EmbeddingService,
    @Inject(forwardRef(() => AiRoutingService))
    private readonly aiRoutingService: AiRoutingService,
  ) {}

  /**
   * Create a new problem submission:
   * Generates dense multilingual embedding vector on creation and stores it in Problem table.
   */
  async create(
    userId: string | null,
    dto: CreateProblemDto,
    mediaFiles: { type: 'photo' | 'voice' | 'doc'; url: string }[] = [],
  ): Promise<Problem> {
    const textToEmbed = `${dto.title}\n${dto.description}`;

    // 1. Generate multilingual embedding vector
    const embedding = await this.embeddingService.embedText(textToEmbed);

    // 2. Classify category if not specified or set to other
    let category = dto.category || ProblemCategory.OTHER;
    if (!dto.category || dto.category === ProblemCategory.OTHER) {
      const classification = await this.aiRoutingService.classifyCategory(textToEmbed);
      category = classification.category;
    }

    const problem = this.repo.create({
      title: dto.title,
      description: dto.description,
      category,
      submitterType: dto.submitterType || SubmitterType.INDIVIDUAL,
      organizationName: dto.organizationName || null,
      registrationId: dto.registrationId || null,
      submitterName: dto.submitterName || null,
      submitterPhone: dto.submitterPhone || null,
      district: dto.district,
      village: dto.village,
      media: mediaFiles.map((m) => ({
        ...m,
        addedBy: userId || 'public',
        addedAt: new Date().toISOString(),
      })),
      submittedById: userId || null,
      status: ProblemStatus.SUBMITTED,
      embedding,
    });

    // Set PostGIS geography point if coordinates provided
    if (dto.latitude != null && dto.longitude != null) {
      (problem as any).location = () =>
        `ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`;
    }

    const saved = await this.repo.save(problem);

    // Save pgvector directly in PostgreSQL
    try {
      const vectorStr = `[${embedding.join(',')}]`;
      await this.dataSource.query(
        `UPDATE problems SET embedding = $1::vector WHERE id = $2`,
        [vectorStr, saved.id],
      );
    } catch (err) {
      this.logger.warn(`Could not set raw pgvector: ${(err as Error).message}`);
    }

    // Enqueue background AI routing job for priority scoring and institution matching
    await this.aiQueue.add('route-problem', { problemId: saved.id }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });

    this.logger.log(`Problem ${saved.id} created with 384-dim embedding and queued for AI routing`);
    return saved;
  }

  /**
   * Check for similar existing problems and classify category (as-you-type debounced).
   * Queries pgvector for top 5 nearest existing OPEN problems within geo-radius.
   */
  async checkSimilar(dto: CheckSimilarDto): Promise<{
    isDuplicate: boolean;
    similarityThreshold: number;
    predictedCategory: ProblemCategory;
    confidence: number;
    duplicatesCount: number;
    similarProblems: DuplicateCandidateResult[];
  }> {
    const text = dto.description ? `${dto.title}\n${dto.description}` : dto.title;
    const threshold = dto.threshold ?? 0.85;

    // 1. Generate query embedding vector
    const embedding = await this.embeddingService.embedText(text);

    // 2. Classify category via nearest centroid
    const classification = await this.aiRoutingService.classifyCategory(text);

    // 3. Search for nearby similar OPEN problems via pgvector + PostGIS
    const similarProblems = await this.aiRoutingService.findDuplicates(null, embedding, {
      latitude: dto.latitude,
      longitude: dto.longitude,
      radiusKm: dto.radiusKm ?? 50,
      threshold,
      district: dto.district,
    });

    return {
      isDuplicate: similarProblems.length > 0,
      similarityThreshold: threshold,
      predictedCategory: classification.category,
      confidence: classification.confidence,
      duplicatesCount: similarProblems.length,
      similarProblems,
    };
  }

  /**
   * Similarity search for duplicate detection (GET /problems/similar backward compatibility).
   */
  async findSimilar(query: string): Promise<DuplicateCandidateResult[]> {
    if (!query || query.trim().length === 0) return [];
    const result = await this.checkSimilar({
      title: query,
      threshold: 0.70,
    });
    return result.similarProblems;
  }

  /**
   * "Add my voice to this instead":
   * Upvotes the canonical problem and attaches the new user's evidence/media instead of duplicating.
   */
  async supportProblem(
    problemId: string,
    userId: string,
    message?: string,
    mediaFiles: { type: 'photo' | 'voice' | 'doc'; url: string }[] = [],
  ): Promise<{ message: string; problem: Problem }> {
    const problem = await this.repo.findOne({ where: { id: problemId } });
    if (!problem) throw new NotFoundException('Problem not found');

    // Add user to upvoters if not already present
    if (!problem.upvoterIds.includes(userId)) {
      problem.upvoterIds = [...problem.upvoterIds, userId];
      problem.upvotes = problem.upvoterIds.length;
    }

    // Attach supporting media and commentary
    const newMedia = mediaFiles.map((m) => ({
      ...m,
      addedBy: userId,
      addedAt: new Date().toISOString(),
      message: message || undefined,
    }));

    if (message && mediaFiles.length === 0) {
      newMedia.push({
        type: 'doc',
        url: '',
        message,
        addedBy: userId,
        addedAt: new Date().toISOString(),
      });
    }

    problem.media = [...(problem.media || []), ...newMedia];

    // Re-calculate priority score with increased upvotes
    problem.priorityScore = this.aiRoutingService.computePriority(problem);

    const saved = await this.repo.save(problem);
    this.logger.log(`Citizen ${userId} added voice/evidence to problem ${problemId}`);

    return {
      message: 'Your voice and supporting evidence have been successfully attached to the challenge.',
      problem: saved,
    };
  }

  /** Get citizen's own submissions */
  async findMine(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.repo.findAndCount({
      where: { submittedById: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: { assignedInstitution: true },
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /** Get nearby problems via PostGIS radius query */
  async findNearby(lat: number, lng: number, radiusKm = 50, page = 1, limit = 20) {
    const radiusMeters = radiusKm * 1000;
    const offset = (page - 1) * limit;

    const items = await this.dataSource.query(
      `SELECT p.*, ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as distance_m
       FROM problems p
       WHERE p.location IS NOT NULL
         AND ST_DWithin(p.location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
         AND p.duplicate_of_id IS NULL
       ORDER BY distance_m ASC
       LIMIT $4 OFFSET $5`,
      [lng, lat, radiusMeters, limit, offset],
    );

    return { items, page, limit };
  }

  /** Upvote / "Me Too" a problem */
  async upvote(problemId: string, userId: string): Promise<{ upvotes: number }> {
    const problem = await this.repo.findOne({ where: { id: problemId } });
    if (!problem) throw new NotFoundException('Problem not found');

    if (problem.upvoterIds.includes(userId)) {
      throw new BadRequestException('You have already upvoted this problem');
    }

    problem.upvoterIds = [...problem.upvoterIds, userId];
    problem.upvotes = problem.upvoterIds.length;
    await this.repo.save(problem);
    return { upvotes: problem.upvotes };
  }

  /** Get a single problem with full details */
  async findOne(id: string): Promise<Problem> {
    const problem = await this.repo.findOne({
      where: { id },
      relations: { submittedBy: true, assignedInstitution: true, duplicateOf: true },
    });
    if (!problem) throw new NotFoundException('Problem not found');
    return problem;
  }

  /** List all problems (admin/institution view) with filters */
  async findAll(query: ProblemsQueryDto) {
    const { page = 1, limit = 20, category, submitterType, district, q } = query;
    const qb = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.assignedInstitution', 'institution')
      .leftJoinAndSelect('p.submittedBy', 'submitter')
      .where('p.duplicateOfId IS NULL')
      .orderBy('p.priorityScore', 'DESC')
      .addOrderBy('p.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (category) qb.andWhere('p.category = :category', { category });
    if (submitterType) qb.andWhere('p.submitterType = :submitterType', { submitterType });
    if (district) qb.andWhere('p.district ILIKE :district', { district: `%${district}%` });
    if (q) qb.andWhere('(p.title ILIKE :q OR p.description ILIKE :q)', { q: `%${q}%` });

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /** Update problem status (used by AI routing, institutions, admin) */
  async updateStatus(id: string, status: ProblemStatus, institutionId?: string): Promise<Problem> {
    const problem = await this.findOne(id);
    problem.status = status;
    if (institutionId) problem.assignedInstitutionId = institutionId;
    return this.repo.save(problem);
  }

  /** Save AI routing result onto problem */
  async saveAiResult(
    id: string,
    result: {
      category: ProblemCategory;
      priorityScore: number;
      duplicateCandidateIds: string[];
      suggestedInstitutionIds: string[];
      suggestedInstitutionsExplained?: {
        institutionId: string;
        institutionName: string;
        matchedOn: string[];
      }[];
    },
  ): Promise<void> {
    await this.repo.update(id, {
      category: result.category,
      priorityScore: result.priorityScore,
      status: ProblemStatus.UNDER_REVIEW,
      aiRoutingResult: {
        category: result.category,
        priorityScore: result.priorityScore,
        duplicateCandidateIds: result.duplicateCandidateIds,
        suggestedInstitutionIds: result.suggestedInstitutionIds,
        suggestedInstitutionsExplained: result.suggestedInstitutionsExplained || [],
      },
    });
  }
}
