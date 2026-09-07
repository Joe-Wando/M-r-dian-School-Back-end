import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { getMentoringOption, MENTORING_OPTIONS } from './mentoring.constants';

const SLOT_HOURS = [10, 15, 18]; // heures proposées (UTC) sur 14 jours ouvrés

@Injectable()
export class MentoringService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Créneaux proposés : les prochains jours ouvrés à 10h/15h/18h,
   * moins ceux déjà réservés (pending ou confirmed).
   */
  async getSlots() {
    const slots = await this.availableSlots(20);
    return { options: MENTORING_OPTIONS, availableSlots: slots.map((d) => d.toISOString()) };
  }

  async createBooking(userId: string, dto: CreateBookingDto) {
    const option = getMentoringOption(dto.durationMinutes);
    if (!option) throw new BadRequestException('Durée de mentorat non proposée.');

    let scheduledAt: Date;
    if (dto.scheduledAt) {
      scheduledAt = new Date(dto.scheduledAt);
      if (scheduledAt.getTime() <= Date.now()) {
        throw new BadRequestException('Le créneau doit être dans le futur.');
      }
      const clash = await this.prisma.mentoringBooking.count({
        where: { scheduledAt, status: { in: ['pending', 'confirmed'] } },
      });
      if (clash > 0) throw new BadRequestException('Ce créneau est déjà réservé.');
    } else {
      // Aucun créneau demandé : on attribue le prochain disponible.
      const [next] = await this.availableSlots(1);
      if (!next) throw new BadRequestException('Aucun créneau disponible pour le moment.');
      scheduledAt = next;
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

  /** Renvoie jusqu'à `limit` créneaux futurs libres (jours ouvrés, SLOT_HOURS). */
  private async availableSlots(limit: number): Promise<Date[]> {
    const now = new Date();
    const taken = await this.prisma.mentoringBooking.findMany({
      where: { scheduledAt: { gte: now }, status: { in: ['pending', 'confirmed'] } },
      select: { scheduledAt: true },
    });
    const takenSet = new Set(taken.map((t) => t.scheduledAt.toISOString()));

    const slots: Date[] = [];
    const cursor = new Date(now);
    cursor.setUTCHours(0, 0, 0, 0);
    let daysChecked = 0;
    while (slots.length < limit && daysChecked < 40) {
      cursor.setUTCDate(cursor.getUTCDate() + 1);
      daysChecked += 1;
      const day = cursor.getUTCDay();
      if (day === 0 || day === 6) continue; // week-end
      for (const h of SLOT_HOURS) {
        const slot = new Date(cursor);
        slot.setUTCHours(h);
        if (slot.getTime() <= now.getTime()) continue;
        if (!takenSet.has(slot.toISOString())) slots.push(slot);
        if (slots.length >= limit) break;
      }
    }
    return slots;
  }
}
