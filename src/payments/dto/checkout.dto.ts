import { IsEnum, IsUUID } from 'class-validator';
import { PaymentItemType } from '@prisma/client';

export class CheckoutDto {
  @IsEnum(PaymentItemType, {
    message: 'itemType doit valoir course, mentoring ou correction.',
  })
  itemType!: PaymentItemType;

  /** Cours, réservation de mentorat, ou soumission de travail à corriger. */
  @IsUUID()
  itemId!: string;
}
