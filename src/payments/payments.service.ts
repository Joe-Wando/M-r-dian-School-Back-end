import { randomUUID } from 'node:crypto';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Payment, PaymentItemType, PaymentStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { NaboopayWebhookDto } from './dto/naboopay-webhook.dto';
import { NaboopayService } from './naboopay.service';

const CONFIRMED_STATES = new Set(['confirmed', 'success', 'succeeded', 'paid', 'completed']);
const FAILED_STATES = new Set(['failed', 'cancelled', 'canceled', 'declined', 'expired']);

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly naboopay: NaboopayService,
  ) {}

  /**
   * Initie un paiement. Le montant est TOUJOURS calculé côté serveur à partir
   * de l'article concerné — jamais fourni par le client.
   */
  async checkout(userId: string, dto: CheckoutDto) {
    const { amount, description } = await this.resolveItem(userId, dto);
    if (amount <= 0) {
      throw new BadRequestException('Cet article est gratuit : aucun paiement requis.');
    }

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const reference = `MRD-${Date.now()}-${randomUUID().slice(0, 8)}`;

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        itemType: dto.itemType,
        itemId: dto.itemId,
        amount,
        status: PaymentStatus.pending,
        naboopayReference: reference,
      },
    });

    const tx = await this.naboopay.createTransaction({
      reference,
      amount,
      description,
      customerName: user.name,
      customerEmail: user.email,
    });

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { naboopayReference: tx.naboopayReference },
    });

    // En mode mock, on confirme immédiatement pour fluidifier le développement.
    // Le statut n'est JAMAIS confirmé sur demande du frontend en production :
    // seul le webhook signé (ci-dessous) le fait.
    if (this.naboopay.isMock) {
      await this.markConfirmed(payment.id);
      this.logger.warn(`MOCK_PAYMENTS : paiement ${payment.id} confirmé automatiquement.`);
    }

    const fresh = await this.prisma.payment.findUniqueOrThrow({ where: { id: payment.id } });
    return {
      payment: this.toDto(fresh),
      checkoutUrl: tx.checkoutUrl,
      mocked: tx.mocked,
    };
  }

  /**
   * Webhook Naboopay — **seule source de vérité** pour valider un paiement.
   * Vérifie la signature, puis met à jour le paiement de façon idempotente.
   */
  async handleWebhook(
    rawBody: Buffer,
    signature: string | undefined,
    payload: NaboopayWebhookDto,
  ) {
    if (!this.naboopay.verifyWebhookSignature(rawBody, signature)) {
      throw new UnauthorizedException('Signature de webhook invalide.');
    }

    const reference =
      payload.reference ?? payload.transaction_reference ?? payload.order_id;
    if (!reference) {
      throw new BadRequestException('Référence de transaction absente du payload.');
    }

    const payment = await this.prisma.payment.findFirst({
      where: {
        OR: [{ naboopayReference: reference }, { naboopayReference: `MOCK-${reference}` }],
      },
    });
    if (!payment) {
      throw new NotFoundException('Aucun paiement ne correspond à cette référence.');
    }

    // Idempotence : un paiement déjà confirmé/échoué n'est plus modifié.
    if (payment.status !== PaymentStatus.pending) {
      return { received: true, status: payment.status, idempotent: true };
    }

    const raw = (payload.status ?? payload.event ?? '').toLowerCase();
    if (CONFIRMED_STATES.has(raw)) {
      await this.markConfirmed(payment.id);
      return { received: true, status: PaymentStatus.confirmed };
    }
    if (FAILED_STATES.has(raw)) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.failed },
      });
      return { received: true, status: PaymentStatus.failed };
    }

    // Statut non concluant : on n'agit pas, on accuse réception.
    return { received: true, status: payment.status, note: `statut ignoré : "${raw}"` };
  }

  async listForUser(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return payments.map((p) => this.toDto(p));
  }

  // ------------------------------------------------------------------
  // Interne
  // ------------------------------------------------------------------

  /** Passe le paiement en `confirmed` et déclenche les effets métier associés. */
  private async markConfirmed(paymentId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.confirmed },
      });

      if (payment.itemType === PaymentItemType.course) {
        await tx.enrollment.upsert({
          where: { userId_courseId: { userId: payment.userId, courseId: payment.itemId } },
          create: { userId: payment.userId, courseId: payment.itemId },
          update: {},
        });
      } else if (payment.itemType === PaymentItemType.mentoring) {
        await tx.mentoringBooking.update({
          where: { id: payment.itemId },
          data: {
            status: 'confirmed',
            meetingLink: `https://meet.meredian.io/${payment.itemId}`,
          },
        });
      } else if (payment.itemType === PaymentItemType.correction) {
        await tx.workSubmission.update({
          where: { id: payment.itemId },
          data: { status: 'in_review' },
        });
      }
    });
  }

  /** Calcule le montant et le libellé selon le type d'article, et vérifie la propriété. */
  private async resolveItem(
    userId: string,
    dto: CheckoutDto,
  ): Promise<{ amount: number; description: string }> {
    switch (dto.itemType) {
      case PaymentItemType.course: {
        const course = await this.prisma.course.findUnique({ where: { id: dto.itemId } });
        if (!course) throw new NotFoundException('Cours introuvable.');
        if (course.isFree) {
          throw new BadRequestException('Ce cours est gratuit.');
        }
        const already = await this.prisma.payment.count({
          where: {
            userId,
            itemType: 'course',
            itemId: dto.itemId,
            status: PaymentStatus.confirmed,
          },
        });
        if (already > 0) {
          throw new BadRequestException('Ce cours a déjà été payé.');
        }
        return { amount: course.price, description: `Cours ${course.code} — ${course.title}` };
      }
      case PaymentItemType.mentoring: {
        const booking = await this.prisma.mentoringBooking.findUnique({
          where: { id: dto.itemId },
        });
        if (!booking) throw new NotFoundException('Réservation de mentorat introuvable.');
        if (booking.userId !== userId) {
          throw new ForbiddenException('Cette réservation ne vous appartient pas.');
        }
        return {
          amount: booking.price,
          description: `Mentorat ${booking.durationMinutes} min`,
        };
      }
      case PaymentItemType.correction: {
        const submission = await this.prisma.workSubmission.findUnique({
          where: { id: dto.itemId },
        });
        if (!submission) throw new NotFoundException('Soumission de travail introuvable.');
        if (submission.userId !== userId) {
          throw new ForbiddenException('Cette soumission ne vous appartient pas.');
        }
        return { amount: submission.price, description: 'Correction de travail' };
      }
      default:
        throw new BadRequestException('Type d\'article inconnu.');
    }
  }

  private toDto(p: Payment) {
    return {
      id: p.id,
      itemType: p.itemType,
      itemId: p.itemId,
      amount: p.amount,
      status: p.status,
      naboopayReference: p.naboopayReference,
      createdAt: p.createdAt,
    };
  }
}
