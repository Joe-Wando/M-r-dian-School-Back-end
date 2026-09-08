import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Recruteur X', minLength: 2, maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'rh@entreprise.com', format: 'email' })
  @IsEmail()
  @MaxLength(180)
  email!: string;

  @ApiProperty({ example: 'Bonjour, votre profil nous intéresse.', minLength: 5, maxLength: 5000 })
  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  message!: string;
}
