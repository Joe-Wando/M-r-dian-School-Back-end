import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateQaSessionDto {
  @ApiProperty({ example: 'Bases de données & SQL', minLength: 3, maxLength: 200 })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  topic!: string;

  @ApiProperty({ format: 'date-time', example: '2026-11-01T17:00:00.000Z' })
  @IsDateString()
  scheduledAt!: string;

  @ApiProperty({ example: 60, minimum: 15, maximum: 240 })
  @IsInt()
  @Min(15)
  @Max(240)
  durationMinutes!: number;

  @ApiProperty({ example: 15, minimum: 1, maximum: 500 })
  @IsInt()
  @Min(1)
  @Max(500)
  maxSpots!: number;
}
