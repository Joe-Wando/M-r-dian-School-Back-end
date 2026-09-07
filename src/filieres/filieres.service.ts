import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CourseCategory, Filiere, Prisma } from '@prisma/client';

import { CATEGORY_LABELS, CategoryLabel } from '../common/enums/course-enums';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFiliereDto } from './dto/update-filiere.dto';

@Injectable()
export class FilieresService {
  constructor(private readonly prisma: PrismaService) {}

  /** Les 4 filières, dans l'ordre du catalogue. */
  async findAll() {
    const rows = await this.prisma.filiere.findMany();
    const byCategory = new Map(rows.map((r) => [r.category, r]));
    return CATEGORY_LABELS.filter((c) => byCategory.has(c as CourseCategory)).map((c) =>
      this.toDto(byCategory.get(c as CourseCategory) as Filiere),
    );
  }

  async findOne(category: string) {
    const cat = this.assertCategory(category);
    const filiere = await this.prisma.filiere.findUnique({ where: { category: cat } });
    if (!filiere) throw new NotFoundException('Filière introuvable.');
    return this.toDto(filiere);
  }

  /**
   * Met à jour (ou crée si absente) le contenu éditorial d'une filière.
   * Réservé aux administrateurs (garde appliquée au niveau du contrôleur).
   */
  async update(category: string, dto: UpdateFiliereDto) {
    const cat = this.assertCategory(category);

    const data = {
      intro: dto.intro,
      videoUrl: dto.videoUrl,
      levels: dto.levels as Prisma.InputJsonValue | undefined,
      certificationText: dto.certificationText,
      certificationUrl: dto.certificationUrl,
    };

    const filiere = await this.prisma.filiere.upsert({
      where: { category: cat },
      update: data,
      create: {
        category: cat,
        intro: dto.intro ?? '',
        videoUrl: dto.videoUrl ?? null,
        levels: (dto.levels ?? {}) as Prisma.InputJsonValue,
        certificationText: dto.certificationText ?? null,
        certificationUrl: dto.certificationUrl ?? null,
      },
    });
    return this.toDto(filiere);
  }

  private assertCategory(value: string): CourseCategory {
    if (!CATEGORY_LABELS.includes(value as CategoryLabel)) {
      throw new BadRequestException(
        `category doit valoir : ${CATEGORY_LABELS.join(', ')}.`,
      );
    }
    return value as CourseCategory;
  }

  private toDto(f: Filiere) {
    return {
      category: f.category,
      intro: f.intro,
      videoUrl: f.videoUrl,
      levels: f.levels,
      certificationText: f.certificationText,
      certificationUrl: f.certificationUrl,
      updatedAt: f.updatedAt,
    };
  }
}
