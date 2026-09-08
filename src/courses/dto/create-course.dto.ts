import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'HIS-101', pattern: '^[A-Z]{2,4}-[A-Z0-9]{2,4}$' })
  @IsString()
  @Matches(/^[A-Z]{2,4}-[A-Z0-9]{2,4}$/, {
    message: 'code doit ressembler à "HIS-101" (2-4 lettres, tiret, 2-4 caractères).',
  })
  code!: string;

  @ApiProperty({ example: 'Les grandes ruptures du XXe siècle', minLength: 3, maxLength: 200 })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @ApiProperty({ enum: CATEGORY_LABELS as unknown as string[] })
  @IsIn(CATEGORY_LABELS as unknown as string[])
  category!: CategoryLabel;

  @ApiProperty({ enum: LEVEL_LABELS as unknown as string[] })
  @IsIn(LEVEL_LABELS as unknown as string[])
  level!: LevelLabel;

  @ApiPropertyOptional({ enum: TEMPLATE_LABELS as unknown as string[], default: 'Mixte' })
  @IsOptional()
  @IsIn(TEMPLATE_LABELS as unknown as string[])
  template?: TemplateLabel;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @ApiProperty({ example: 12000, description: 'Prix en FCFA (0 si gratuit)' })
  @IsInt()
  @Min(0)
  @Max(10_000_000)
  price!: number;

  @ApiPropertyOptional({ example: '5h' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  duration?: string;

  @ApiPropertyOptional({ maxLength: 4000 })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.meredian.io/his-101.pdf' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  pdfResourceUrl?: string;
}
