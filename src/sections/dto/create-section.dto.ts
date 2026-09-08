import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { SectionType } from '@prisma/client';

import { QuizQuestionDto } from './quiz-question.dto';
import { SectionPhotoDto } from './section-photo.dto';

export class CreateSectionDto {
  @ApiProperty({ example: 'Introduction au sujet', minLength: 2, maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiProperty({ enum: SectionType, enumName: 'SectionType' })
  @IsEnum(SectionType, {
    message: 'type doit valoir reading, image, video ou quiz.',
  })
  type!: SectionType;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @ApiPropertyOptional({ example: '12 min' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  duration?: string;

  @ApiPropertyOptional({ description: 'Vidéo pratique obligatoire (parties code)' })
  @IsOptional()
  @IsBoolean()
  practical?: boolean;

  @ApiPropertyOptional({ description: 'Contenu markdown — type = reading', maxLength: 50000 })
  @IsOptional()
  @IsString()
  @MaxLength(50_000)
  body?: string;

  @ApiPropertyOptional({ description: 'Lien de la vidéo hébergée — type = video', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  videoUrl?: string;

  @ApiPropertyOptional({ type: [SectionPhotoDto], description: 'Galerie — type = image' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionPhotoDto)
  photos?: SectionPhotoDto[];

  @ApiPropertyOptional({ type: [QuizQuestionDto], description: 'Questions — type = quiz' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  quiz?: QuizQuestionDto[];
}
