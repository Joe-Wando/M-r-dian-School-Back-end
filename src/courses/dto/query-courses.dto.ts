import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

import {
  CATEGORY_LABELS,
  CategoryLabel,
  LEVEL_LABELS,
  LevelLabel,
} from '../../common/enums/course-enums';

export class QueryCoursesDto {
  @IsOptional()
  @IsIn(CATEGORY_LABELS as unknown as string[])
  category?: CategoryLabel;

  @IsOptional()
  @IsIn(LEVEL_LABELS as unknown as string[])
  level?: LevelLabel;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  query?: string;
}
