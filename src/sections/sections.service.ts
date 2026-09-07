import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SectionType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { QuizQuestionDto } from './dto/quiz-question.dto';
import { SectionPhotoDto } from './dto/section-photo.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(moduleId: string, dto: CreateSectionDto) {
    const mod = await this.prisma.module.findUnique({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException('Module introuvable.');

    this.assertContentMatchesType(dto.type, dto);

    const orderIndex = dto.orderIndex ?? (await this.nextOrderIndex(moduleId));

    return this.prisma.section.create({
      data: {
        moduleId,
        title: dto.title,
        type: dto.type,
        orderIndex,
        duration: dto.duration ?? '',
        practical: dto.practical ?? false,
        body: dto.type === SectionType.reading ? (dto.body ?? null) : null,
        videoUrl: dto.type === SectionType.video ? (dto.videoUrl ?? null) : null,
        photos:
          dto.type === SectionType.image && dto.photos
            ? { create: this.mapPhotos(dto.photos) }
            : undefined,
        quiz:
          dto.type === SectionType.quiz && dto.quiz
            ? { create: this.mapQuiz(dto.quiz) }
            : undefined,
      },
      include: { photos: true, quiz: true },
    });
  }

  /**
   * Mise à jour d'une section : gère différemment les 4 types de contenu.
   *  - reading : champ `body`
   *  - video   : champ `videoUrl`
   *  - image   : sous-ressources `section_photos` (remplacées en bloc)
   *  - quiz    : sous-ressources `quiz_questions` (remplacées en bloc)
   */
  async update(id: string, dto: UpdateSectionDto) {
    const section = await this.prisma.section.findUnique({ where: { id } });
    if (!section) throw new NotFoundException('Section introuvable.');

    // Le type peut changer ; on prend le nouveau si fourni, sinon l'actuel.
    const type = dto.type ?? section.type;
    this.assertContentMatchesType(type, dto);

    const data: Prisma.SectionUpdateInput = {
      title: dto.title,
      type: dto.type,
      orderIndex: dto.orderIndex,
      duration: dto.duration,
      practical: dto.practical,
    };

    // Contenu textuel selon le type cible.
    if (type === SectionType.reading) {
      if (dto.body !== undefined) data.body = dto.body;
      data.videoUrl = null;
    } else if (type === SectionType.video) {
      if (dto.videoUrl !== undefined) data.videoUrl = dto.videoUrl;
      data.body = null;
    } else {
      data.body = null;
      data.videoUrl = null;
    }

    return this.prisma.$transaction(async (tx) => {
      // Sous-ressources image : remplacement complet si `photos` fourni,
      // ou nettoyage si le type n'est plus `image`.
      if (type === SectionType.image) {
        if (dto.photos !== undefined) {
          await tx.sectionPhoto.deleteMany({ where: { sectionId: id } });
          await tx.sectionPhoto.createMany({
            data: this.mapPhotos(dto.photos).map((p) => ({ ...p, sectionId: id })),
          });
        }
      } else {
        await tx.sectionPhoto.deleteMany({ where: { sectionId: id } });
      }

      // Sous-ressources quiz : même logique.
      if (type === SectionType.quiz) {
        if (dto.quiz !== undefined) {
          await tx.quizQuestion.deleteMany({ where: { sectionId: id } });
          await tx.quizQuestion.createMany({
            data: this.mapQuiz(dto.quiz).map((q) => ({ ...q, sectionId: id })),
          });
        }
      } else {
        await tx.quizQuestion.deleteMany({ where: { sectionId: id } });
      }

      return tx.section.update({
        where: { id },
        data,
        include: { photos: { orderBy: { orderIndex: 'asc' } }, quiz: { orderBy: { orderIndex: 'asc' } } },
      });
    });
  }

  async remove(id: string) {
    const count = await this.prisma.section.count({ where: { id } });
    if (count === 0) throw new NotFoundException('Section introuvable.');
    await this.prisma.section.delete({ where: { id } });
    return { deleted: true, id };
  }

  // --- helpers ---

  private assertContentMatchesType(
    type: SectionType,
    dto: CreateSectionDto | UpdateSectionDto,
  ): void {
    if (type === SectionType.quiz && dto.quiz) {
      for (const q of dto.quiz) {
        if (q.correctIndex >= q.options.length) {
          throw new BadRequestException(
            `correctIndex (${q.correctIndex}) hors de la liste d'options.`,
          );
        }
      }
    }
    // Un usage incohérent (ex : body sur une vidéo) est simplement ignoré à
    // l'écriture plutôt que rejeté, pour rester tolérant côté admin.
  }

  private mapPhotos(photos: SectionPhotoDto[]) {
    return photos.map((p, i) => ({
      url: p.url,
      caption: p.caption ?? '',
      orderIndex: p.orderIndex ?? i,
    }));
  }

  private mapQuiz(quiz: QuizQuestionDto[]) {
    return quiz.map((q, i) => ({
      question: q.question,
      options: q.options as Prisma.InputJsonValue,
      correctIndex: q.correctIndex,
      orderIndex: q.orderIndex ?? i,
    }));
  }

  private async nextOrderIndex(moduleId: string): Promise<number> {
    const last = await this.prisma.section.findFirst({
      where: { moduleId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });
    return (last?.orderIndex ?? -1) + 1;
  }
}
