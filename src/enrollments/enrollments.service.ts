import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  fromPrismaLevel,
  fromPrismaTemplate,
} from '../common/enums/course-enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Inscrit l'utilisateur à un cours.
   *  - Cours gratuit : inscription immédiate.
   *  - Cours payant : nécessite un paiement `confirmed` (créé par le webhook
   *    Naboopay, jamais par le frontend). Idempotent si déjà inscrit.
   */
  async enroll(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Cours introuvable.');

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) return existing;

    if (!course.isFree) {
      const paid = await this.prisma.payment.count({
        where: { userId, itemType: 'course', itemId: courseId, status: 'confirmed' },
      });
      if (paid === 0) {
        throw new ForbiddenException(
          'Ce cours est payant : effectuez le paiement avant de vous inscrire.',
        );
      }
    }

    return this.prisma.enrollment.create({ data: { userId, courseId } });
  }

  /** Marque une section comme complétée (idempotent). L'utilisateur doit être inscrit. */
  async completeSection(userId: string, sectionId: string) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: { module: { select: { courseId: true } } },
    });
    if (!section) throw new NotFoundException('Section introuvable.');

    const enrolled = await this.prisma.enrollment.count({
      where: { userId, courseId: section.module.courseId },
    });
    if (enrolled === 0) {
      throw new ForbiddenException("Vous n'êtes pas inscrit à ce cours.");
    }

    await this.prisma.sectionCompletion.upsert({
      where: { userId_sectionId: { userId, sectionId } },
      create: { userId, sectionId },
      update: {},
    });

    const progress = await this.courseProgress(userId, section.module.courseId);
    return { sectionId, completed: true, progress };
  }

  /** Cours suivis par l'utilisateur, avec progression calculée à la volée. */
  async listUserCourses(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      orderBy: { enrolledAt: 'desc' },
      include: { course: true },
    });

    return Promise.all(
      enrollments.map(async (e) => ({
        enrolledAt: e.enrolledAt,
        course: {
          id: e.course.id,
          code: e.course.code,
          title: e.course.title,
          category: e.course.category,
          level: fromPrismaLevel(e.course.level),
          template: fromPrismaTemplate(e.course.template),
          isFree: e.course.isFree,
          price: e.course.price,
          duration: e.course.duration,
        },
        progress: await this.courseProgress(userId, e.courseId),
      })),
    );
  }

  /**
   * Progression d'un cours : sections complétées / total des sections.
   * Toujours recalculée, jamais stockée en dur.
   */
  async courseProgress(userId: string, courseId: string) {
    const total = await this.prisma.section.count({
      where: { module: { courseId } },
    });
    const completed = await this.prisma.sectionCompletion.count({
      where: { userId, section: { module: { courseId } } },
    });

    return {
      completedSections: completed,
      totalSections: total,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }
}
