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
var ProblemsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemsService = exports.AI_ROUTING_QUEUE = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const problem_entity_1 = require("./problem.entity");
const embedding_service_1 = require("../ai-routing/embedding.service");
const ai_routing_service_1 = require("../ai-routing/ai-routing.service");
exports.AI_ROUTING_QUEUE = 'ai-routing';
let ProblemsService = ProblemsService_1 = class ProblemsService {
    constructor(repo, aiQueue, dataSource, embeddingService, aiRoutingService) {
        this.repo = repo;
        this.aiQueue = aiQueue;
        this.dataSource = dataSource;
        this.embeddingService = embeddingService;
        this.aiRoutingService = aiRoutingService;
        this.logger = new common_1.Logger(ProblemsService_1.name);
    }
    async create(userId, dto, mediaFiles = []) {
        const textToEmbed = `${dto.title}\n${dto.description}`;
        const embedding = await this.embeddingService.embedText(textToEmbed);
        let category = dto.category || problem_entity_1.ProblemCategory.OTHER;
        if (!dto.category || dto.category === problem_entity_1.ProblemCategory.OTHER) {
            const classification = await this.aiRoutingService.classifyCategory(textToEmbed);
            category = classification.category;
        }
        const problem = this.repo.create({
            title: dto.title,
            description: dto.description,
            category,
            submitterType: dto.submitterType || problem_entity_1.SubmitterType.INDIVIDUAL,
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
            status: problem_entity_1.ProblemStatus.SUBMITTED,
            embedding,
        });
        if (dto.latitude != null && dto.longitude != null) {
            problem.location = () => `ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`;
        }
        const saved = await this.repo.save(problem);
        try {
            const vectorStr = `[${embedding.join(',')}]`;
            await this.dataSource.query(`UPDATE problems SET embedding = $1::vector WHERE id = $2`, [vectorStr, saved.id]);
        }
        catch (err) {
            this.logger.warn(`Could not set raw pgvector: ${err.message}`);
        }
        await this.aiQueue.add('route-problem', { problemId: saved.id }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
        });
        this.logger.log(`Problem ${saved.id} created with 384-dim embedding and queued for AI routing`);
        return saved;
    }
    async checkSimilar(dto) {
        const text = dto.description ? `${dto.title}\n${dto.description}` : dto.title;
        const threshold = dto.threshold ?? 0.85;
        const embedding = await this.embeddingService.embedText(text);
        const classification = await this.aiRoutingService.classifyCategory(text);
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
    async findSimilar(query) {
        if (!query || query.trim().length === 0)
            return [];
        const result = await this.checkSimilar({
            title: query,
            threshold: 0.70,
        });
        return result.similarProblems;
    }
    async supportProblem(problemId, userId, message, mediaFiles = []) {
        const problem = await this.repo.findOne({ where: { id: problemId } });
        if (!problem)
            throw new common_1.NotFoundException('Problem not found');
        if (!problem.upvoterIds.includes(userId)) {
            problem.upvoterIds = [...problem.upvoterIds, userId];
            problem.upvotes = problem.upvoterIds.length;
        }
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
        problem.priorityScore = this.aiRoutingService.computePriority(problem);
        const saved = await this.repo.save(problem);
        this.logger.log(`Citizen ${userId} added voice/evidence to problem ${problemId}`);
        return {
            message: 'Your voice and supporting evidence have been successfully attached to the challenge.',
            problem: saved,
        };
    }
    async findMine(userId, page = 1, limit = 20) {
        const [items, total] = await this.repo.findAndCount({
            where: { submittedById: userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: { assignedInstitution: true },
        });
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findNearby(lat, lng, radiusKm = 50, page = 1, limit = 20) {
        const radiusMeters = radiusKm * 1000;
        const offset = (page - 1) * limit;
        const items = await this.dataSource.query(`SELECT p.*, ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as distance_m
       FROM problems p
       WHERE p.location IS NOT NULL
         AND ST_DWithin(p.location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
         AND p.duplicate_of_id IS NULL
       ORDER BY distance_m ASC
       LIMIT $4 OFFSET $5`, [lng, lat, radiusMeters, limit, offset]);
        return { items, page, limit };
    }
    async upvote(problemId, userId) {
        const problem = await this.repo.findOne({ where: { id: problemId } });
        if (!problem)
            throw new common_1.NotFoundException('Problem not found');
        if (problem.upvoterIds.includes(userId)) {
            throw new common_1.BadRequestException('You have already upvoted this problem');
        }
        problem.upvoterIds = [...problem.upvoterIds, userId];
        problem.upvotes = problem.upvoterIds.length;
        await this.repo.save(problem);
        return { upvotes: problem.upvotes };
    }
    async findOne(id) {
        const problem = await this.repo.findOne({
            where: { id },
            relations: { submittedBy: true, assignedInstitution: true, duplicateOf: true },
        });
        if (!problem)
            throw new common_1.NotFoundException('Problem not found');
        return problem;
    }
    async findAll(query) {
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
        if (category)
            qb.andWhere('p.category = :category', { category });
        if (submitterType)
            qb.andWhere('p.submitterType = :submitterType', { submitterType });
        if (district)
            qb.andWhere('p.district ILIKE :district', { district: `%${district}%` });
        if (q)
            qb.andWhere('(p.title ILIKE :q OR p.description ILIKE :q)', { q: `%${q}%` });
        const [items, total] = await qb.getManyAndCount();
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async updateStatus(id, status, institutionId) {
        const problem = await this.findOne(id);
        problem.status = status;
        if (institutionId)
            problem.assignedInstitutionId = institutionId;
        return this.repo.save(problem);
    }
    async saveAiResult(id, result) {
        await this.repo.update(id, {
            category: result.category,
            priorityScore: result.priorityScore,
            status: problem_entity_1.ProblemStatus.UNDER_REVIEW,
            aiRoutingResult: {
                category: result.category,
                priorityScore: result.priorityScore,
                duplicateCandidateIds: result.duplicateCandidateIds,
                suggestedInstitutionIds: result.suggestedInstitutionIds,
                suggestedInstitutionsExplained: result.suggestedInstitutionsExplained || [],
            },
        });
    }
};
exports.ProblemsService = ProblemsService;
exports.ProblemsService = ProblemsService = ProblemsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(problem_entity_1.Problem)),
    __param(1, (0, bullmq_1.InjectQueue)(exports.AI_ROUTING_QUEUE)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => ai_routing_service_1.AiRoutingService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        bullmq_2.Queue,
        typeorm_2.DataSource,
        embedding_service_1.EmbeddingService,
        ai_routing_service_1.AiRoutingService])
], ProblemsService);
//# sourceMappingURL=problems.service.js.map