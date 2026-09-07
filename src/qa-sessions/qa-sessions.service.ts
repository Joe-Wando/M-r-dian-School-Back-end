import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateQaSessionDto } from './dto/create-qa-session.dto';

@Injectable()
export class QaSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Sessions à venir, avec le nombre de places restantes. */
  async findUpcoming() {
    const sessions = await this.prisma.qaSession.findMany({
      where: { scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: 'asc' },
      include: { _count: { select: { registrations: true } } },
    });

    return sessions.map((s) => ({
      id: s.id,
      topic: s.topic,
      scheduledAt: s.scheduledAt,
      durationMinutes: s.durationMinutes,
      maxSpots: s.maxSpots,
      registeredCount: s._count.registrations,
      spotsLeft: Math.max(0, s.maxSpots - s._count.registrations),
    }));
  }

  async register(userId: string, sessionId: string) {
    const session = await this.prisma.qaSession.findUnique({
      where: { id: sessionId },
      include: { _count: { select: { registrations: true } } },
    });
    if (!session) throw new NotFoundException('Session Q&R introuvable.');
    if (session.scheduledAt.getTime() < Date.now()) {
      throw new BadRequestException('Cette session est déjà passée.');
    }

    const existing = await this.prisma.qaRegistration.findUnique({
      where: { sessionId_userId: { sessionId, userId } },
    });
    if (existing) throw new ConflictException('Vous êtes déjà inscrit à cette session.');

    if (session._count.registrations >= session.maxSpots) {
      throw new ConflictException('Session complète.');
    }

    await this.prisma.qaRegistration.create({ data: { sessionId, userId } });
    return { registered: true, sessionId };
  }

  async create(dto: CreateQaSessionDto) {
    return this.prisma.qaSession.create({
      data: {
        topic: dto.topic,
        scheduledAt: new Date(dto.scheduledAt),
        durationMinutes: dto.durationMinutes,
        maxSpots: dto.maxSpots,
      },
    });
  }
}
