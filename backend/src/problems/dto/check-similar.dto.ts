import {
  IsString,
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
  IsLatitude,
  IsLongitude,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CheckSimilarDto {
  @ApiProperty({
    example: 'Arsenic contamination in drinking water in Bokaro Village',
    description: 'Title of the problem report',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  title: string;

  @ApiPropertyOptional({
    example: 'The village borewell water has high arsenic levels and people are falling sick...',
    description: 'Detailed description of the problem',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 23.8, description: 'GPS latitude coordinate' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ example: 86.4, description: 'GPS longitude coordinate' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ example: 50, description: 'Search radius in kilometers' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  radiusKm?: number = 50;

  @ApiPropertyOptional({ example: 0.85, description: 'Cosine similarity threshold (0.0 to 1.0)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  @Max(1.0)
  threshold?: number = 0.85;

  @ApiPropertyOptional({ example: 'Bokaro', description: 'District name' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  district?: string;
}

export class SupportProblemDto {
  @ApiPropertyOptional({
    example: 'I am also facing this issue in Ward 4. Attaching photo evidence.',
    description: 'Optional commentary or evidence description',
  })
  @IsOptional()
  @IsString()
  message?: string;
}
