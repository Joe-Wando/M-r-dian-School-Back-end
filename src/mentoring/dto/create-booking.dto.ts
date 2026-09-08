import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsInt, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ enum: [30, 60], example: 30 })
  @IsInt()
  @IsIn([30, 60], { message: 'durationMinutes doit valoir 30 ou 60.' })
  durationMinutes!: 30 | 60;

  @ApiPropertyOptional({
    format: 'date-time',
    example: '2026-10-15T15:00:00.000Z',
    description: 'Optionnel : si absent, le prochain créneau libre est attribué automatiquement.',
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
