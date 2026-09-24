import { OnModuleInit } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Problem, ProblemCategory } from '../problems/problem.entity';
import { Institution } from '../institutions/institution.entity';
import { AIRoutingResult, CategoryClassificationResult, DuplicateCandidateResult, SuggestedInstitutionMatch } from './ai-routing.interface';
import { EmbeddingService } from './embedding.service';
export declare class AiRoutingService implements OnModuleInit {
    private readonly problemRepo;
    private readonly institutionRepo;
    private readonly dataSource;
    private readonly embeddingService;
    private readonly logger;
    private themeCentroids;
    private isInitialized;
    constructor(problemRepo: Repository<Problem>, institutionRepo: Repository<Institution>, dataSource: DataSource, embeddingService: EmbeddingService);
    onModuleInit(): Promise<void>;
    initThemeCentroids(): Promise<void>;
    classifyCategory(text: string): Promise<CategoryClassificationResult>;
    routeProblem(problemId: string): Promise<AIRoutingResult>;
    findDuplicates(excludeProblemId: string | null, queryEmbedding: number[], options?: {
        latitude?: number;
        longitude?: number;
        radiusKm?: number;
        threshold?: number;
        district?: string;
    }): Promise<DuplicateCandidateResult[]>;
    private findDuplicatesFallback;
    computePriority(problem: Problem): number;
    intersectTags(institution: Pick<Institution, 'researchAreas' | 'domainTags' | 'incubationCells'>, categoryTags: string[]): string[];
    suggestInstitutions(category: ProblemCategory, district?: string | null): Promise<SuggestedInstitutionMatch[]>;
}
