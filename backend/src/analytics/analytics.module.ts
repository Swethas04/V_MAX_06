import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { InstitutionsModule } from '../institutions/institutions.module';

@Module({
  imports: [InstitutionsModule],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
