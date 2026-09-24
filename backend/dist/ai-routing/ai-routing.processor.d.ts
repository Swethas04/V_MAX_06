import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AiRoutingService } from './ai-routing.service';
import { ProblemsService } from '../problems/problems.service';
export declare class AiRoutingProcessor extends WorkerHost {
    private readonly aiService;
    private readonly problemsService;
    private readonly logger;
    constructor(aiService: AiRoutingService, problemsService: ProblemsService);
    process(job: Job<{
        problemId: string;
    }>): Promise<void>;
}
