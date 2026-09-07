import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSkillDto } from './dto/skill.dto';
import { CreateWorkDto } from './dto/work.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /** Vitrine publique : profil + compétences + réalisations. */
  async getPublicProfile() {
    const [profile, skills, works] = await Promise.all([
      this.prisma.profile.findFirst(),
      this.prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] }),
      this.prisma.work.findMany({ orderBy: { title: 'asc' } }),
    ]);

    return {
      profile: profile ?? null,
      skills,
      works,
    };
  }

  /** Met à jour l'unique ligne de profil (la crée si elle n'existe pas). */
  async updateProfile(dto: UpdateProfileDto) {
    const data = {
      ...dto,
      timeline: dto.timeline as Prisma.InputJsonValue | undefined,
    };
    const existing = await this.prisma.profile.findFirst();
    if (!existing) {
      return this.prisma.profile.create({ data });
    }
    return this.prisma.profile.update({ where: { id: existing.id }, data });
  }

  addSkill(dto: CreateSkillDto) {
    return this.prisma.skill.create({ data: dto });
  }

  async removeSkill(id: string) {
    await this.prisma.skill.delete({ where: { id } });
    return { deleted: true, id };
  }

  addWork(dto: CreateWorkDto) {
    return this.prisma.work.create({ data: { ...dto, description: dto.description ?? '' } });
  }

  async removeWork(id: string) {
    await this.prisma.work.delete({ where: { id } });
    return { deleted: true, id };
  }
}
