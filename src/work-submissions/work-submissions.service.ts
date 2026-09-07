import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkSubmissionDto } from './dto/create-work-submission.dto';

/** Tarif forfaitaire d'une correction de travail (FCFA), fixé côté serveur. */
export const CORRECTION_PRICE = 5000;

@Injectable()
export class WorkSubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkSubmissionDto) {
    const submission = await this.prisma.workSubmission.create({
      data: {
        userId,
        fileUrl: dto.fileUrl,
        note: dto.note ?? '',
        price: CORRECTION_PRICE,
        status: 'pending',
      },
    });

    return {
      submission,
      nextStep:
        'Soumission enregistrée. Appelez POST /payments/checkout avec ' +
        `{ "itemType": "correction", "itemId": "${submission.id}" } pour lancer la correction.`,
    };
  }

  async listForUser(userId: string) {
    return this.prisma.workSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
