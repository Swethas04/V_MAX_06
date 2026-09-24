import { IsString, IsOptional, IsUUID, IsArray, IsEnum, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MilestoneStatus } from '../milestone.entity';

export class CreateTeamDto {
  @ApiProperty()
  @IsUUID()
  problemId: string;

  @ApiProperty()
  @IsUUID()
  institutionId: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  studentIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  facultyMentorId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  domainTags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  proposalSummary?: string;
}

export class CreateMilestoneDto {
  @ApiProperty({ example: 'Prototype ready' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsString()
  dueDate?: string;
}

export class UpdateMilestoneDto {
  @ApiPropertyOptional({ enum: MilestoneStatus })
  @IsOptional()
  @IsEnum(MilestoneStatus)
  status?: MilestoneStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dueDate?: string;
}

export class IndustryOfferDto {
  @ApiProperty({ enum: ['mentorship', 'funding', 'lab_access', 'pilot_site'] })
  @IsEnum(['mentorship', 'funding', 'lab_access', 'pilot_site'])
  type: 'mentorship' | 'funding' | 'lab_access' | 'pilot_site';

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({ example: 500000, description: 'Amount in INR (for funding offers)' })
  @IsOptional()
  amount?: number;
}
