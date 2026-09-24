import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ProblemsController } from './problems.controller';
import { ProblemsService, AI_ROUTING_QUEUE } from './problems.service';
import { Problem } from './problem.entity';
import { AiRoutingModule } from '../ai-routing/ai-routing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Problem]),
    BullModule.registerQueue({ name: AI_ROUTING_QUEUE }),
    forwardRef(() => AiRoutingModule),
  ],
  controllers: [ProblemsController],
  providers: [ProblemsService],
  exports: [ProblemsService],
})
export class ProblemsModule {}
