import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AiRoutingService } from './ai-routing.service';
import { ProblemsService, AI_ROUTING_QUEUE } from '../problems/problems.service';

@Processor(AI_ROUTING_QUEUE)
export class AiRoutingProcessor extends WorkerHost {
  private readonly logger = new Logger(AiRoutingProcessor.name);

  constructor(
    private readonly aiService: AiRoutingService,
    private readonly problemsService: ProblemsService,
  ) {
    super();
  }

  async process(job: Job<{ problemId: string }>): Promise<void> {
    const { problemId } = job.data;
    this.logger.log(`Processing AI routing job for problem: ${problemId}`);

    try {
      const result = await this.aiService.routeProblem(problemId);
      await this.problemsService.saveAiResult(problemId, result);
      this.logger.log(
        `AI routing complete for ${problemId}: category=${result.category}, priority=${result.priorityScore}`,
      );
    } catch (err) {
      this.logger.error(`AI routing failed for ${problemId}: ${(err as Error).message}`);
      throw err; // BullMQ will retry per job config
    }
  }
}
