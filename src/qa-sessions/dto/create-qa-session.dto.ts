import { IsDateString, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateQaSessionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  topic!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsInt()
  @Min(15)
  @Max(240)
  durationMinutes!: number;

  @IsInt()
  @Min(1)
  @Max(500)
  maxSpots!: number;
}
