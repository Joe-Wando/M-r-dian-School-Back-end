import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { join } from 'node:path';

import { AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkSubmissionDto } from './dto/create-work-submission.dto';
import { ReviewWorkSubmissionDto } from './dto/review-work-submission.dto';
import { uploadDir } from './multer.config';

/** Tarif forfaitaire d'une correction de travail (FCFA), fixé côté serveur. */
export const CORRECTION_PRICE = 5000;

@Injectable()
export class WorkSubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkSubmissionDto, file: Express.Multer.File) {
    const submission = await this.prisma.workSubmission.create({
      data: {
        userId,
        originalFileName: file.originalname,
        storedFileName: file.filename,
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

  async listAllForAdmin() {
    return this.prisma.workSubmission.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async review(
    id: string,
    dto: ReviewWorkSubmissionDto,
    feedbackFile: Express.Multer.File | undefined,
  ) {
    await this.findOrThrow(id);

    return this.prisma.workSubmission.update({
      where: { id },
      data: {
        ...(dto.status != null && { status: dto.status }),
        ...(dto.feedback != null && { feedback: dto.feedback }),
        ...(feedbackFile && {
          feedbackOriginalFileName: feedbackFile.originalname,
          feedbackStoredFileName: feedbackFile.filename,
        }),
        reviewedAt: new Date(),
      },
    });
  }

  /** Résout le fichier (original ou correction) à streamer, en vérifiant les droits d'accès. */
  async getFileForDownload(
    id: string,
    user: AuthenticatedUser,
    variant: 'original' | 'feedback',
  ): Promise<{ absolutePath: string; downloadName: string }> {
    const submission = await this.findOrThrow(id);

    if (submission.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Cette soumission ne vous appartient pas.');
    }

    if (variant === 'original') {
      return {
        absolutePath: join(uploadDir('work-submissions'), submission.storedFileName),
        downloadName: submission.originalFileName,
      };
    }

    if (!submission.feedbackStoredFileName || !submission.feedbackOriginalFileName) {
      throw new NotFoundException('Aucun fichier de correction disponible pour l\'instant.');
    }
    return {
      absolutePath: join(uploadDir('work-submissions/feedback'), submission.feedbackStoredFileName),
      downloadName: submission.feedbackOriginalFileName,
    };
  }

  private async findOrThrow(id: string) {
    const submission = await this.prisma.workSubmission.findUnique({ where: { id } });
    if (!submission) throw new NotFoundException('Soumission introuvable.');
    return submission;
  }
}
