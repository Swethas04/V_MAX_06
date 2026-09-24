import { ProblemsService } from './problems.service';
import { CreateProblemDto, ProblemsQueryDto, CheckSimilarDto, SupportProblemDto } from './dto/problem.dto';
export declare class ProblemsController {
    private readonly service;
    constructor(service: ProblemsService);
    create(req: any, dto: CreateProblemDto, files?: Express.Multer.File[]): Promise<import("./problem.entity").Problem>;
    checkSimilar(dto: CheckSimilarDto): Promise<{
        isDuplicate: boolean;
        similarityThreshold: number;
        predictedCategory: import("./problem.entity").ProblemCategory;
        confidence: number;
        duplicatesCount: number;
        similarProblems: import("../ai-routing/ai-routing.interface").DuplicateCandidateResult[];
    }>;
    supportProblem(id: string, req: any, dto: SupportProblemDto, files?: Express.Multer.File[]): Promise<{
        message: string;
        problem: import("./problem.entity").Problem;
    }>;
    findAll(query: ProblemsQueryDto): Promise<{
        items: import("./problem.entity").Problem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findMine(req: any, page?: number, limit?: number): Promise<{
        items: import("./problem.entity").Problem[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findNearby(lat: number, lng: number, radius?: number, page?: number, limit?: number): Promise<{
        items: any;
        page: number;
        limit: number;
    }>;
    findSimilar(q: string): Promise<import("../ai-routing/ai-routing.interface").DuplicateCandidateResult[]>;
    findOne(id: string): Promise<import("./problem.entity").Problem>;
    upvote(id: string, req: any): Promise<{
        upvotes: number;
    }>;
}
