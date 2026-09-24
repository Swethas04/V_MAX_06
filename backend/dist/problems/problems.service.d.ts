import { Repository, DataSource } from 'typeorm';
import { Queue } from 'bullmq';
import { Problem, ProblemStatus, ProblemCategory } from './problem.entity';
import { CreateProblemDto, ProblemsQueryDto, CheckSimilarDto } from './dto/problem.dto';
import { EmbeddingService } from '../ai-routing/embedding.service';
import { AiRoutingService } from '../ai-routing/ai-routing.service';
import { DuplicateCandidateResult } from '../ai-routing/ai-routing.interface';
export declare const AI_ROUTING_QUEUE = "ai-routing";
export declare class ProblemsService {
    private readonly repo;
    private readonly aiQueue;
    private readonly dataSource;
    private readonly embeddingService;
    private readonly aiRoutingService;
    private readonly logger;
    constructor(repo: Repository<Problem>, aiQueue: Queue, dataSource: DataSource, embeddingService: EmbeddingService, aiRoutingService: AiRoutingService);
    create(userId: string | null, dto: CreateProblemDto, mediaFiles?: {
        type: 'photo' | 'voice' | 'doc';
        url: string;
    }[]): Promise<Problem>;
    checkSimilar(dto: CheckSimilarDto): Promise<{
        isDuplicate: boolean;
        similarityThreshold: number;
        predictedCategory: ProblemCategory;
        confidence: number;
        duplicatesCount: number;
        similarProblems: DuplicateCandidateResult[];
    }>;
    findSimilar(query: string): Promise<DuplicateCandidateResult[]>;
    supportProblem(problemId: string, userId: string, message?: string, mediaFiles?: {
        type: 'photo' | 'voice' | 'doc';
        url: string;
    }[]): Promise<{
        message: string;
        problem: Problem;
    }>;
    findMine(userId: string, page?: number, limit?: number): Promise<{
        items: Problem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findNearby(lat: number, lng: number, radiusKm?: number, page?: number, limit?: number): Promise<{
        items: any;
        page: number;
        limit: number;
    }>;
    upvote(problemId: string, userId: string): Promise<{
        upvotes: number;
    }>;
    findOne(id: string): Promise<Problem>;
    findAll(query: ProblemsQueryDto): Promise<{
        items: Problem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateStatus(id: string, status: ProblemStatus, institutionId?: string): Promise<Problem>;
    saveAiResult(id: string, result: {
        category: ProblemCategory;
        priorityScore: number;
        duplicateCandidateIds: string[];
        suggestedInstitutionIds: string[];
        suggestedInstitutionsExplained?: {
            institutionId: string;
            institutionName: string;
            matchedOn: string[];
        }[];
    }): Promise<void>;
}
