import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWorkSubmissionDto {
  /** URL du fichier déposé (stockage S3-compatible géré côté frontend/upload). */
  @IsString()
  @MaxLength(2000)
  fileUrl!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  note?: string;
}
