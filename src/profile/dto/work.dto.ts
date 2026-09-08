import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWorkDto {
  @ApiProperty({ example: 'API de gestion de bibliothèque', minLength: 2, maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: 'Informatique', maxLength: 80 })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  category!: string;

  @ApiPropertyOptional({ maxLength: 4000 })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @ApiPropertyOptional({ example: 'https://github.com/…' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  link?: string;
}
