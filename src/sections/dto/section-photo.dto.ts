import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class SectionPhotoDto {
  @IsString()
  @MaxLength(2000)
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
