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
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @IsEnum(SectionType, {
    message: 'type doit valoir reading, image, video ou quiz.',
  })
  type!: SectionType;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  duration?: string;

  @IsOptional()
  @IsBoolean()
  practical?: boolean;

  // type = reading
  @IsOptional()
  @IsString()
  @MaxLength(50_000)
  body?: string;

  // type = video
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  videoUrl?: string;

  // type = image
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionPhotoDto)
  photos?: SectionPhotoDto[];

  // type = quiz
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizQuestionDto)
  quiz?: QuizQuestionDto[];
}
