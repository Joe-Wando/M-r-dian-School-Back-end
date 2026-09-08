import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

import { IsStringRecord } from '../../common/validators/is-string-record.validator';

export class UpdateFiliereDto {
  @ApiPropertyOptional({ maxLength: 4000 })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  intro?: string;

  @ApiPropertyOptional({ example: 'https://stream.meredian.io/filieres/histoire.m3u8' })
  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @MaxLength(2000)
  videoUrl?: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { L1: 'Poser les bases…', L2: 'Approfondir…', L3: 'Analyser…' },
    description: '{ niveau: texte } — valeurs non vides',
  })
  @IsOptional()
  @IsStringRecord()
  levels?: Record<string, string>;

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  certificationText?: string;

  @ApiPropertyOptional({ example: 'https://cert.example/histoire' })
  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @MaxLength(2000)
  certificationUrl?: string;
}
