import { createHmac, timingSafeEqual } from 'node:crypto';

import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface NaboopayTransactionInput {
  reference: string;
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
}

export interface NaboopayTransactionResult {
  naboopayReference: string;
  checkoutUrl: string;
  mocked: boolean;
}

/**
 * Intégration Naboopay.
 *
 * ⚠️ Intégration réelle repoussée : les identifiants marchand et la
 * documentation officielle (schéma exact de signature du webhook, endpoints,
 * payloads) ne sont pas encore disponibles.
 *
 * Tant que `MOCK_PAYMENTS=true`, aucune requête n'est envoyée à Naboopay :
 * `createTransaction` renvoie une fausse URL de paiement et le paiement est
 * confirmé immédiatement côté service (voir PaymentsService).
 *
 * TODO (quand la doc Naboopay sera disponible) :
 *   1. Implémenter l'appel réel `POST {NABOOPAY_API_URL}/.../create-transaction`
 *      avec l'en-tête `Authorization: Bearer {NABOOPAY_API_KEY}`.
 *   2. Ajuster `verifyWebhookSignature` au schéma réel (nom du header,
 *      algorithme, contenu signé — corps brut vs sous-ensemble).
 *   3. Ajouter une VÉRIFICATION SERVEUR SUPPLÉMENTAIRE : à réception du webhook,
 *      rappeler l'API Naboopay (`GET .../transaction/{reference}`) pour
 *      reconfirmer le statut réel avant de passer le paiement en `confirmed`.
 *      La signature seule ne doit pas être l'unique rempart.
 */
@Injectable()
export class NaboopayService {
  private readonly logger = new Logger(NaboopayService.name);

  constructor(private readonly config: ConfigService) {}

  private get mock(): boolean {
    return this.config.get<boolean>('payments.mock') ?? true;
  }

  async createTransaction(
    input: NaboopayTransactionInput,
  ): Promise<NaboopayTransactionResult> {
    if (this.mock) {
      this.logger.warn(
        `MOCK_PAYMENTS actif — transaction simulée pour ${input.reference} (${input.amount} FCFA).`,
      );
      return {
        naboopayReference: `MOCK-${input.reference}`,
        checkoutUrl: `https://mock.naboopay.local/checkout/${input.reference}`,
        mocked: true,
      };
    }

    // Intégration réelle non encore implémentée (voir docstring de la classe).
    throw new NotImplementedException(
      "L'intégration réelle Naboopay n'est pas encore disponible. " +
        'Définir MOCK_PAYMENTS=true en attendant.',
    );
  }

  /**
   * Vérifie la signature HMAC-SHA256 du webhook.
   *
   * Schéma GÉNÉRIQUE (à confirmer avec la doc Naboopay) :
   *   signature = hex( HMAC_SHA256( secret = NABOOPAY_WEBHOOK_SECRET, message = corps brut ) )
   * transmise dans le header `NABOOPAY_WEBHOOK_SIGNATURE_HEADER`.
   */
  verifyWebhookSignature(rawBody: Buffer, providedSignature: string | undefined): boolean {
    if (this.mock) {
      // En mode mock on n'exige pas de signature valide (pratique pour les tests
      // locaux), mais si un secret ET une signature sont fournis, on les vérifie.
      if (!providedSignature) return true;
    }

    const secret = this.config.get<string>('payments.webhookSecret') ?? '';
    if (!secret || !providedSignature) return false;

    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(providedSignature.trim().replace(/^sha256=/, ''), 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }

  get signatureHeaderName(): string {
    return this.config.get<string>('payments.webhookSignatureHeader') ?? 'x-naboopay-signature';
  }

  get isMock(): boolean {
    return this.mock;
  }
}
