import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { getMentoringOption, MENTORING_OPTIONS } from './mentoring.constants';

const SLOT_HOURS = [10, 15, 18]; // heures proposées (UTC) sur 14 jours ouvrés

@Injectable()
export class MentoringService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Créneaux proposés : les 14 prochains jours ouvrés à 10h/15h/18h,
   * moins ceux déjà réservés (pending ou confirmed).
   */
  async getSlots() {
    const now = new Date();
    const taken = await this.prisma.mentoringBooking.findMany({
      where: { scheduledAt: { gte: now }, status: { in: ['pending', 'confirmed'] } },
      select: { scheduledAt: true },
    });
    const takenSet = new Set(taken.map((t) => t.scheduledAt.toISOString()));

    const slots: string[] = [];
    const cursor = new Date(now);
    cursor.setUTCHours(0, 0, 0, 0);
    let daysChecked = 0;
    while (slots.length < 20 && daysChecked < 30) {
      cursor.setUTCDate(cursor.getUTCDate() + 1);
      daysChecked += 1;
      const day = cursor.getUTCDay();
      if (day === 0 || day === 6) continue; // week-end
      for (const h of SLOT_HOURS) {
        const slot = new Date(cursor);
        slot.setUTCHours(h);
        const iso = slot.toISOString();
        if (!takenSet.has(iso)) slots.push(iso);
      }
    }

    return { options: MENTORING_OPTIONS, availableSlots: slots };
  }

  async createBooking(userId: string, dto: CreateBookingDto) {
    const option = getMentoringOption(dto.durationMinutes);
    if (!option) throw new BadRequestException('Durée de mentorat non proposée.');

    const scheduledAt = new Date(dto.scheduledAt);
    if (scheduledAt.getTime() <= Date.now()) {
      throw new BadRequestException('Le créneau doit être dans le futur.');
    }

    const clash = await this.prisma.mentoringBooking.count({
      where: { scheduledAt, status: { in: ['pending', 'confirmed'] } },
    });
    if (clash > 0) {
      throw new BadRequestException('Ce créneau est déjà réservé.');
    }

    const booking = await this.prisma.mentoringBooking.create({
      data: {
        userId,
        durationMinutes: dto.durationMinutes,
        price: option.price,
        scheduledAt,
        status: 'pending',
      },
    });

    return {
      booking,
      nextStep:
        'Réservation créée en attente de paiement. Appelez POST /payments/checkout ' +
        `avec { "itemType": "mentoring", "itemId": "${booking.id}" }.`,
    };
  }
}
