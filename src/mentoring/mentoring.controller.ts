import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MentoringService } from './mentoring.service';

@ApiTags('Accompagnement')
@Controller('mentoring')
export class MentoringController {
  constructor(private readonly mentoringService: MentoringService) {}

  /** Offre + créneaux disponibles (public). */
  @Get('slots')
  getSlots() {
    return this.mentoringService.getSlots();
  }

  /** Réservation d'un créneau (utilisateur connecté). Le paiement se fait ensuite. */
  @Post('bookings')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  createBooking(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBookingDto,
  ) {
    return this.mentoringService.createBooking(user.id, dto);
  }
}
