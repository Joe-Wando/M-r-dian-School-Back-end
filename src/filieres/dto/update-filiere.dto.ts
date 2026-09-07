import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

import { IsStringRecord } from '../../common/validators/is-string-record.validator';

export class UpdateFiliereDto {
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  intro?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @MaxLength(2000)
  videoUrl?: string;

  /** Ex : { "L1": "...", "L2": "...", "L3": "...", "Formation Pro": "..." } */
  @IsOptional()
  @IsStringRecord()
  levels?: Record<string, string>;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  certificationText?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @MaxLength(2000)
  certificationUrl?: string;
}
