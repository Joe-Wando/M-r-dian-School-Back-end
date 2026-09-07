import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';

import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CheckoutDto } from './dto/checkout.dto';
import { NaboopayWebhookDto } from './dto/naboopay-webhook.dto';
import { NaboopayService } from './naboopay.service';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly naboopay: NaboopayService,
  ) {}

  /** Initie un paiement Naboopay (cours, mentorat ou correction). */
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(@CurrentUser() user: AuthenticatedUser, @Body() dto: CheckoutDto) {
    return this.paymentsService.checkout(user.id, dto);
  }

  /** Historique des paiements de l'utilisateur connecté. */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  myPayments(@CurrentUser() user: AuthenticatedUser) {
    return this.paymentsService.listForUser(user.id);
  }

  /**
   * Webhook Naboopay — public (appelé par Naboopay), mais protégé par
   * vérification de signature HMAC-SHA256. Seule voie pour confirmer un paiement.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers() headers: Record<string, string>,
    @Body() payload: NaboopayWebhookDto,
  ) {
    const signature = headers[this.naboopay.signatureHeaderName];
    const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(payload));
    return this.paymentsService.handleWebhook(rawBody, signature, payload);
  }
}
