import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class SectionPhotoDto {
  @ApiProperty({ example: 'https://cdn.meredian.io/demo/1.jpg', maxLength: 2000 })
  @IsString()
  @MaxLength(2000)
  url!: string;

  @ApiPropertyOptional({ example: 'Légende de la photo', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
