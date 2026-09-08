import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@meredian.io', format: 'email' })
  @IsEmail()
  @MaxLength(180)
  email!: string;

  @ApiProperty({ example: 'MotDePasse!2026' })
  @IsString()
  @MaxLength(128)
  password!: string;
}
