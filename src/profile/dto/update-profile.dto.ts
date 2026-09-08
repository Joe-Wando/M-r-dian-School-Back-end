import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Meredian', maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @ApiPropertyOptional({ maxLength: 300 })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  headline?: string;

  @ApiPropertyOptional({ maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  bio?: string;

  @ApiPropertyOptional({ example: 'https://meredian.io/cv.pdf' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  cvUrl?: string;

  @ApiPropertyOptional({ example: 'https://meredian.io/pitch.mp4' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  pitchVideoUrl?: string;

  @ApiPropertyOptional({ example: 'Zurich, Suisse', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ example: 'contact@meredian.io', format: 'email' })
  @IsOptional()
  @IsEmail()
  @MaxLength(180)
  emailContact?: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'object' },
    description: '[{ year, type: "formation" | "experience", title, place }]',
  })
  @IsOptional()
  @IsArray()
  timeline?: Array<Record<string, unknown>>;
}
