import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import {
  CATEGORY_LABELS,
  CategoryLabel,
  LEVEL_LABELS,
  LevelLabel,
  TEMPLATE_LABELS,
  TemplateLabel,
} from '../../common/enums/course-enums';

export class CreateCourseDto {
  @IsString()
  @Matches(/^[A-Z]{2,4}-[A-Z0-9]{2,4}$/, {
    message: 'code doit ressembler à "HIS-101" (2-4 lettres, tiret, 2-4 caractères).',
  })
  code!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @IsIn(CATEGORY_LABELS as unknown as string[])
  category!: CategoryLabel;

  @IsIn(LEVEL_LABELS as unknown as string[])
  level!: LevelLabel;

  @IsOptional()
  @IsIn(TEMPLATE_LABELS as unknown as string[])
  template?: TemplateLabel;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsInt()
  @Min(0)
  @Max(10_000_000)
  price!: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  duration?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  pdfResourceUrl?: string;
}
