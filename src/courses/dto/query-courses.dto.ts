import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

import {
  CATEGORY_LABELS,
  CategoryLabel,
  LEVEL_LABELS,
  LevelLabel,
} from '../../common/enums/course-enums';

export class QueryCoursesDto {
  @ApiPropertyOptional({ enum: CATEGORY_LABELS as unknown as string[] })
  @IsOptional()
  @IsIn(CATEGORY_LABELS as unknown as string[])
  category?: CategoryLabel;

  @ApiPropertyOptional({ enum: LEVEL_LABELS as unknown as string[] })
  @IsOptional()
  @IsIn(LEVEL_LABELS as unknown as string[])
  level?: LevelLabel;

  @ApiPropertyOptional({ description: 'Recherche plein texte sur titre / description / code' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  query?: string;
}
