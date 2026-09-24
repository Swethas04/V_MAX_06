"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AiRoutingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRoutingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const problem_entity_1 = require("../problems/problem.entity");
const institution_entity_1 = require("../institutions/institution.entity");
const embedding_service_1 = require("./embedding.service");
const reference_themes_data_1 = require("./reference-themes.data");
let AiRoutingService = AiRoutingService_1 = class AiRoutingService {
    constructor(problemRepo, institutionRepo, dataSource, embeddingService) {
        this.problemRepo = problemRepo;
        this.institutionRepo = institutionRepo;
        this.dataSource = dataSource;
        this.embeddingService = embeddingService;
        this.logger = new common_1.Logger(AiRoutingService_1.name);
        this.themeCentroids = new Map();
        this.isInitialized = false;
    }
    async onModuleInit() {
        await this.initThemeCentroids();
    }
    async initThemeCentroids() {
        if (this.isInitialized)
            return;
        this.logger.log('🧠 Computing theme centroid embeddings from reference datasets...');
        try {
            for (const [categoryKey, phrases] of Object.entries(reference_themes_data_1.THEME_REFERENCE_PHRASES)) {
                const category = categoryKey;
                const phraseEmbeddings = await this.embeddingService.embedBatch(phrases);
                const centroid = new Array(embedding_service_1.EMBEDDING_DIMENSION).fill(0);
                for (const emb of phraseEmbeddings) {
                    for (let i = 0; i < embedding_service_1.EMBEDDING_DIMENSION; i++) {
                        centroid[i] += emb[i];
                    }
                }
                const n = phraseEmbeddings.length;
                for (let i = 0; i < embedding_service_1.EMBEDDING_DIMENSION; i++) {
                    centroid[i] /= n;
                }
                const normalizedCentroid = this.embeddingService.normalizeVector(centroid);
                this.themeCentroids.set(category, normalizedCentroid);
            }
            this.isInitialized = true;
            this.logger.log(`✅ Pre-computed ${this.themeCentroids.size} theme centroids successfully.`);
        }
        catch (err) {
            this.logger.error(`Failed to initialize theme centroids: ${err.message}`);
        }
    }
    async classifyCategory(text) {
        if (!this.isInitialized || this.themeCentroids.size === 0) {
            await this.initThemeCentroids();
        }
        const queryEmbedding = await this.embeddingService.embedText(text);
        const scores = {};
        let bestCategory = problem_entity_1.ProblemCategory.OTHER;
        let maxSimilarity = -1;
        for (const [category, centroid] of this.themeCentroids.entries()) {
            const similarity = this.embeddingService.cosineSimilarity(queryEmbedding, centroid);
            scores[category] = Math.round(similarity * 1000) / 1000;
            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                bestCategory = category;
            }
        }
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
    async routeProblem(problemId) {
        const problem = await this.problemRepo.findOne({ where: { id: problemId } });
        if (!problem)
            throw new Error(`Problem ${problemId} not found`);
        const text = `${problem.title}\n${problem.description}`;
        const embedding = await this.embeddingService.embedText(text);
        const { category, confidence } = await this.classifyCategory(text);
        const priorityScore = this.computePriority(problem);
        const duplicates = await this.findDuplicates(problemId, embedding, {
            district: problem.district ?? undefined,
            threshold: 0.85,
        });
        const duplicateCandidateIds = duplicates.map((d) => d.id);
        const suggestedInstitutions = await this.suggestInstitutions(category, problem.district);
        const suggestedInstitutionIds = suggestedInstitutions.map((i) => i.institutionId);
        try {
            const vectorStr = `[${embedding.join(',')}]`;
            await this.dataSource.query(`UPDATE problems SET embedding = $1::vector WHERE id = $2`, [vectorStr, problemId]);
        }
        catch (err) {
            this.logger.warn(`Could not save raw pgvector directly: ${err.message}`);
        }
        this.logger.log(`AI Routing for ${problemId}: category=${category} (conf=${confidence}), priority=${priorityScore}, duplicates=${duplicateCandidateIds.length}`);
        return {
            category,
            confidence,
            priorityScore,
            duplicateCandidateIds,
            suggestedInstitutionIds,
            suggestedInstitutionsExplained: suggestedInstitutions,
        };
    }
    async findDuplicates(excludeProblemId, queryEmbedding, options = {}) {
        const threshold = options.threshold ?? 0.85;
        const radiusMeters = (options.radiusKm ?? 50) * 1000;
        const vectorStr = `[${queryEmbedding.join(',')}]`;
        try {
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
            const params = [vectorStr, options.latitude ?? null, options.longitude ?? null];
            let paramIdx = 4;
            if (excludeProblemId) {
                query += ` AND p.id != $${paramIdx++}`;
                params.push(excludeProblemId);
            }
            if (options.latitude != null && options.longitude != null) {
                query += ` AND (p.location IS NULL OR ST_DWithin(p.location::geography, ST_SetSRID(ST_MakePoint($3, $2), 4326)::geography, $${paramIdx++}))`;
                params.push(radiusMeters);
            }
            else if (options.district) {
                query += ` AND (p.district ILIKE $${paramIdx++} OR p.district IS NULL)`;
                params.push(`%${options.district}%`);
            }
            query += ` AND (1 - (p.embedding <=> $1::vector)) >= $${paramIdx++}`;
            params.push(threshold);
            query += ` ORDER BY similarity DESC LIMIT 5`;
            const results = await this.dataSource.query(query, params);
            return results.map((r) => ({
                id: r.id,
                title: r.title,
                description: r.description,
                category: r.category,
                status: r.status,
                similarity: Math.round(parseFloat(r.similarity) * 1000) / 1000,
                distanceKm: r.distance_km != null ? Math.round(parseFloat(r.distance_km) * 10) / 10 : null,
                upvotes: parseInt(r.upvotes || '0', 10),
                district: r.district,
                village: r.village,
                media: r.media || [],
                createdAt: r.createdAt,
            }));
        }
        catch (err) {
            this.logger.warn(`pgvector query fallback invoked: ${err.message}`);
            return this.findDuplicatesFallback(excludeProblemId, queryEmbedding, options);
        }
    }
    async findDuplicatesFallback(excludeProblemId, queryEmbedding, options) {
        const threshold = options.threshold ?? 0.85;
        try {
            const qb = this.problemRepo
                .createQueryBuilder('p')
                .where('p.duplicateOfId IS NULL')
                .andWhere('p.status NOT IN (:...closedStatuses)', {
                closedStatuses: [problem_entity_1.ProblemStatus.RESOLVED, problem_entity_1.ProblemStatus.REJECTED],
            });
            if (excludeProblemId) {
                qb.andWhere('p.id != :id', { id: excludeProblemId });
            }
            const openProblems = await qb.take(50).getMany();
            const scored = [];
            for (const p of openProblems) {
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
        }
        catch {
            return [];
        }
    }
    computePriority(problem) {
        const upvoteScore = Math.min(problem.upvotes * 2, 30);
        const ageHours = (Date.now() - new Date(problem.createdAt || Date.now()).getTime()) / 3600000;
        const recencyScore = Math.max(0, 30 - ageHours * 0.1);
        const urgentKeywords = [
            'urgent', 'emergency', 'critical', 'fatal', 'death', 'crisis', 'immediate',
            'hazard', 'danger', 'outbreak', 'poison', 'collapse',
            'जरूरी', 'आपातकाल', 'खतरा', 'मौत', 'जहर', 'गंभीर', 'तबाही'
        ];
        const text = `${problem.title} ${problem.description}`.toLowerCase();
        const urgencyMatches = urgentKeywords.filter((k) => text.includes(k)).length;
        const textUrgency = Math.min(urgencyMatches * 10, 40);
        return Math.min(100, Math.round(upvoteScore + recencyScore + textUrgency));
    }
    intersectTags(institution, categoryTags) {
        const combined = [
            ...(institution.researchAreas || []),
            ...(institution.domainTags || []),
            ...(institution.incubationCells || []),
        ];
        const matched = [];
        const seen = new Set();
        for (const tag of combined) {
            if (!tag)
                continue;
            const trimmedTag = tag.trim();
            const normTag = trimmedTag.toLowerCase();
            if (seen.has(normTag))
                continue;
            const isMatch = categoryTags.some((cTag) => {
                const normCat = cTag.trim().toLowerCase();
                return (normTag === normCat ||
                    normTag.includes(normCat) ||
                    normCat.includes(normTag));
            });
            if (isMatch) {
                seen.add(normTag);
                matched.push(trimmedTag);
            }
        }
        return matched;
    }
    async suggestInstitutions(category, district) {
        const categoryToTags = {
            [problem_entity_1.ProblemCategory.WATER]: [
                'water',
                'Water Resource Research',
                'water resources',
                'civil engineering',
                'environmental',
                'hydrology',
            ],
            [problem_entity_1.ProblemCategory.AGRICULTURE]: [
                'agriculture',
                'agritech',
                'AgriTech Incubation Cell',
                'food tech',
                'biotechnology',
                'rural tech',
                'Rural Technology Centre',
            ],
            [problem_entity_1.ProblemCategory.HEALTHCARE]: [
                'biomedical',
                'pharmacy',
                'public health',
                'healthcare',
                'pharmaceutical sciences',
                'medical devices',
            ],
            [problem_entity_1.ProblemCategory.EDUCATION]: [
                'education',
                'social science',
                'psychology',
                'edtech',
                'IT',
            ],
            [problem_entity_1.ProblemCategory.ENVIRONMENT]: [
                'environmental',
                'environment',
                'chemistry',
                'ecology',
                'waste management',
                'clean tech',
            ],
            [problem_entity_1.ProblemCategory.ROADS]: [
                'civil engineering',
                'transportation',
                'urban planning',
                'roads',
                'infrastructure',
            ],
            [problem_entity_1.ProblemCategory.URBAN_INFRA]: [
                'electrical',
                'civil engineering',
                'urban planning',
                'smart city',
                'energy',
            ],
            [problem_entity_1.ProblemCategory.ACCESSIBILITY]: [
                'assistive technology',
                'biomedical',
                'civil engineering',
                'accessibility',
            ],
            [problem_entity_1.ProblemCategory.LIVELIHOOD]: [
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
                .where('i.researchAreas && :tags OR i.domainTags && :tags OR i.incubationCells && :tags', { tags })
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
        }
        catch (err) {
            this.logger.warn(`suggestInstitutions query fallback: ${err.message}`);
            return [];
        }
    }
};
exports.AiRoutingService = AiRoutingService;
exports.AiRoutingService = AiRoutingService = AiRoutingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(problem_entity_1.Problem)),
    __param(1, (0, typeorm_1.InjectRepository)(institution_entity_1.Institution)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        embedding_service_1.EmbeddingService])
], AiRoutingService);
//# sourceMappingURL=ai-routing.service.js.map