import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { AiRoutingService } from './ai-routing.service';
import { AiRoutingProcessor } from './ai-routing.processor';
import { EmbeddingService } from './embedding.service';
import { Problem } from '../problems/problem.entity';
import { Institution } from '../institutions/institution.entity';
import { ProblemsModule } from '../problems/problems.module';
import { AI_ROUTING_QUEUE } from '../problems/problems.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Problem, Institution]),
    BullModule.registerQueue({ name: AI_ROUTING_QUEUE }),
    forwardRef(() => ProblemsModule),
  ],
  providers: [EmbeddingService, AiRoutingService, AiRoutingProcessor],
  exports: [EmbeddingService, AiRoutingService],
})
export class AiRoutingModule {}
