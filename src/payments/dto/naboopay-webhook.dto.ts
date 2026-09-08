import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Payload du webhook Naboopay — schéma provisoire, tolérant.
 * À figer une fois la documentation officielle obtenue.
 * On accepte plusieurs noms de champs possibles pour la référence et le statut.
 */
export class NaboopayWebhookDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  order_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transaction_reference?: string;

  @ApiPropertyOptional({ example: 'confirmed' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  event?: string;
}
