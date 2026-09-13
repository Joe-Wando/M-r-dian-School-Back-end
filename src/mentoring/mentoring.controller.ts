import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
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

  @Get('admin/bookings')
  @ApiTags('Admin')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  listBookings() {
    return this.mentoringService.listAllForAdmin();
  }

  @Patch('admin/bookings/:id')
  @ApiTags('Admin')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateBooking(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.mentoringService.updateBooking(id, dto);
  }
}
