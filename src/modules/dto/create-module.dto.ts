import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ example: 'Introduction', minLength: 2, maxLength: 200 })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ description: "Position d'affichage ; auto-incrémentée si absente", example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
