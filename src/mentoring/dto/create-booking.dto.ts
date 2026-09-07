import { IsDateString, IsIn, IsInt, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @IsIn([30, 60], { message: 'durationMinutes doit valoir 30 ou 60.' })
  durationMinutes!: 30 | 60;

  /**
   * Créneau souhaité, au format ISO 8601 (ex : 2026-09-20T15:00:00.000Z).
   * Optionnel : si absent, le prochain créneau libre est attribué automatiquement.
   */
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
