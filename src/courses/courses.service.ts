import { Injectable, NotFoundException } from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';

import {
  fromPrismaLevel,
  fromPrismaTemplate,
  toPrismaCategory,
  toPrismaLevel,
  toPrismaTemplate,
} from '../common/enums/course-enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Catalogue public, avec filtres optionnels. */
  async findAll(query: QueryCoursesDto) {
    const where: Prisma.CourseWhereInput = {};

    if (query.category) where.category = toPrismaCategory(query.category);
    if (query.level) where.level = toPrismaLevel(query.level);
    if (query.query) {
      where.OR = [
        { title: { contains: query.query, mode: 'insensitive' } },
        { description: { contains: query.query, mode: 'insensitive' } },
        { code: { contains: query.query, mode: 'insensitive' } },
      ];
    }

    const courses = await this.prisma.course.findMany({
      where,
      orderBy: [{ category: 'asc' }, { level: 'asc' }, { code: 'asc' }],
    });
    return courses.map((c) => this.toDto(c));
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Cours introuvable.');
    return this.toDto(course);
  }

  /** Structure complète : modules + sections + sous-ressources, triées. */
  async findModules(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            sections: {
              orderBy: { orderIndex: 'asc' },
              include: {
                photos: { orderBy: { orderIndex: 'asc' } },
                quiz: { orderBy: { orderIndex: 'asc' } },
              },
            },
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Cours introuvable.');

    return {
      courseId: course.id,
      code: course.code,
      title: course.title,
      modules: course.modules.map((m) => ({
        id: m.id,
        title: m.title,
        orderIndex: m.orderIndex,
        sections: m.sections.map((s) => ({
          id: s.id,
          title: s.title,
          type: s.type,
          orderIndex: s.orderIndex,
          duration: s.duration,
          practical: s.practical,
          body: s.type === 'reading' ? s.body : null,
          videoUrl: s.type === 'video' ? s.videoUrl : null,
          photos: s.type === 'image' ? s.photos : [],
          quiz:
            s.type === 'quiz'
              ? s.quiz.map((q) => ({
                  id: q.id,
                  question: q.question,
                  options: q.options,
                  correctIndex: q.correctIndex,
                  orderIndex: q.orderIndex,
                }))
              : [],
        })),
      })),
    };
  }

  async create(dto: CreateCourseDto) {
    const course = await this.prisma.course.create({
      data: {
        code: dto.code.toUpperCase(),
        title: dto.title,
        category: toPrismaCategory(dto.category),
        level: toPrismaLevel(dto.level),
        template: dto.template ? toPrismaTemplate(dto.template) : undefined,
        isFree: dto.isFree ?? dto.price === 0,
        price: dto.price,
        duration: dto.duration ?? '',
        description: dto.description ?? '',
        pdfResourceUrl: dto.pdfResourceUrl ?? null,
      },
    });
    return this.toDto(course);
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.ensureExists(id);
    const course = await this.prisma.course.update({
      where: { id },
      data: {
        code: dto.code ? dto.code.toUpperCase() : undefined,
        title: dto.title,
        category: dto.category ? toPrismaCategory(dto.category) : undefined,
        level: dto.level ? toPrismaLevel(dto.level) : undefined,
        template: dto.template ? toPrismaTemplate(dto.template) : undefined,
        isFree: dto.isFree,
        price: dto.price,
        duration: dto.duration,
        description: dto.description,
        pdfResourceUrl: dto.pdfResourceUrl,
      },
    });
    return this.toDto(course);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.course.delete({ where: { id } });
    return { deleted: true, id };
  }

  private async ensureExists(id: string): Promise<void> {
    const count = await this.prisma.course.count({ where: { id } });
    if (count === 0) throw new NotFoundException('Cours introuvable.');
  }

  /** Sérialisation : renvoie les libellés lisibles pour level/template. */
  private toDto(course: Course) {
    return {
      id: course.id,
      code: course.code,
      title: course.title,
      category: course.category,
      level: fromPrismaLevel(course.level),
      template: fromPrismaTemplate(course.template),
      isFree: course.isFree,
      price: course.price,
      duration: course.duration,
      description: course.description,
      pdfResourceUrl: course.pdfResourceUrl,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
}
