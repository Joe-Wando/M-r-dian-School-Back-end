import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'Informatique', maxLength: 80 })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  category!: string;

  @ApiProperty({ example: 'React', maxLength: 120 })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;
}
