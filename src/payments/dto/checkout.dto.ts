import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { PaymentItemType } from '@prisma/client';

export class CheckoutDto {
  @ApiProperty({ enum: PaymentItemType, enumName: 'PaymentItemType' })
  @IsEnum(PaymentItemType, {
    message: 'itemType doit valoir course, mentoring ou correction.',
  })
  itemType!: PaymentItemType;

  @ApiProperty({
    format: 'uuid',
    description: 'Cours, réservation de mentorat, ou soumission de travail à corriger',
  })
  @IsUUID()
  itemId!: string;
}
