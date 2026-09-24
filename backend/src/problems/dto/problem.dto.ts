import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsLatitude,
  IsLongitude,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProblemCategory, SubmitterType } from '../problem.entity';
import { Type } from 'class-transformer';

export class CreateProblemDto {
  @ApiProperty({ example: 'Contaminated drinking water in Bokaro Village' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'The borewell water has turned yellowish since March...' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({ enum: ProblemCategory })
  @IsOptional()
  @IsEnum(ProblemCategory)
  category?: ProblemCategory;

  @ApiPropertyOptional({ enum: SubmitterType, default: SubmitterType.INDIVIDUAL })
  @IsOptional()
  @IsEnum(SubmitterType)
  submitterType?: SubmitterType = SubmitterType.INDIVIDUAL;

  @ApiPropertyOptional({ example: 'Chandankiyari Gram Panchayat' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  organizationName?: string;

  @ApiPropertyOptional({ example: 'JH-GP-BOK-042' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  registrationId?: string;

  @ApiPropertyOptional({ example: 'Ramesh Kumar Mahto' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  submitterName?: string;

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  submitterPhone?: string;

  @ApiPropertyOptional({ example: 23.8 })
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ example: 86.4 })
  @IsOptional()
  @IsNumber()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ example: 'Bokaro' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  district?: string;

  @ApiPropertyOptional({ example: 'Chandankiyari' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  village?: string;
}

export class ProblemsQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: ProblemCategory })
  @IsOptional()
  @IsEnum(ProblemCategory)
  category?: ProblemCategory;

  @ApiPropertyOptional({ enum: SubmitterType })
  @IsOptional()
  @IsEnum(SubmitterType)
  submitterType?: SubmitterType;

  @ApiPropertyOptional({ example: 23.8 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 86.4 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ example: 10, description: 'Radius in km' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  radius?: number = 50;

  @ApiPropertyOptional({ example: 'Bokaro' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'water scarcity' })
  @IsOptional()
  @IsString()
  q?: string;
}

export { CheckSimilarDto, SupportProblemDto } from './check-similar.dto';
