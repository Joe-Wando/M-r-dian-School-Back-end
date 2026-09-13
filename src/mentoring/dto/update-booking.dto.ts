import { ApiPropertyOptional } from '@nestjs/swagger';
import { MentoringStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateBookingDto {
  @ApiPropertyOptional({ enum: MentoringStatus, enumName: 'MentoringStatus' })
  @IsOptional()
  @IsEnum(MentoringStatus, {
    message: 'status doit valoir pending, confirmed, completed ou cancelled.',
  })
  status?: MentoringStatus;

  @ApiPropertyOptional({ maxLength: 2000, example: 'https://meet.meredian.io/abc123' })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'meetingLink doit être une URL valide.' })
  @MaxLength(2000)
  meetingLink?: string;
}
