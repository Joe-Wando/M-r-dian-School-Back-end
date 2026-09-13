import { ApiPropertyOptional } from '@nestjs/swagger';
import { WorkSubmissionStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class ReviewWorkSubmissionDto {
  @ApiPropertyOptional({ enum: WorkSubmissionStatus, enumName: 'WorkSubmissionStatus' })
  @IsOptional()
  @IsEnum(WorkSubmissionStatus, {
    message: 'status doit valoir pending, in_review ou completed.',
  })
  status?: WorkSubmissionStatus;

  @ApiPropertyOptional({ maxLength: 8000 })
  @IsOptional()
  @IsString()
  @MaxLength(8000)
  feedback?: string;
}
