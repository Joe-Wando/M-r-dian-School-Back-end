import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWorkSubmissionDto {
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
