import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class QuizQuestionDto {
  @ApiProperty({ example: 'Quelle année marque le début de la Première Guerre mondiale ?' })
  @IsString()
  @MaxLength(1000)
  question!: string;

  @ApiProperty({ type: [String], example: ['1912', '1914', '1918'], minItems: 2, maxItems: 8 })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  options!: string[];

  @ApiProperty({ example: 1, description: 'Index (0-based) de la bonne réponse dans `options`' })
  @IsInt()
  @Min(0)
  correctIndex!: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
