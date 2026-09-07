import { IsOptional, IsString } from 'class-validator';

/**
 * Payload du webhook Naboopay — schéma provisoire, tolérant.
 * À figer une fois la documentation officielle obtenue.
 *
 * On accepte plusieurs noms de champs possibles pour la référence et le statut.
 */
export class NaboopayWebhookDto {
  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  order_id?: string;

  @IsOptional()
  @IsString()
  transaction_reference?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  event?: string;
}
