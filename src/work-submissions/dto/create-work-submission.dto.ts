import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWorkSubmissionDto {
  @ApiProperty({
    example: 'https://files.meredian.io/devoir.pdf',
    description: 'URL du fichier déposé (upload géré côté frontend / stockage S3)',
    maxLength: 2000,
  })
  @IsString()
  @MaxLength(2000)
  fileUrl!: string;

  @ApiPropertyOptional({
    example: 'Dissertation de droit constitutionnel',
    maxLength: 4000,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  note?: string;
}
