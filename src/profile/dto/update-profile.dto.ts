import { IsArray, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  headline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  cvUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  pitchVideoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(180)
  emailContact?: string;

  /** [{ year, type: "formation" | "experience", title, place }] */
  @IsOptional()
  @IsArray()
  timeline?: Array<Record<string, unknown>>;
}
