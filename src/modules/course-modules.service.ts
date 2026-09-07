import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class CourseModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(courseId: string, dto: CreateModuleDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Cours introuvable.');

    const orderIndex = dto.orderIndex ?? (await this.nextOrderIndex(courseId));
    return this.prisma.module.create({
      data: { courseId, title: dto.title, orderIndex },
    });
  }

  async update(id: string, dto: UpdateModuleDto) {
    await this.ensureExists(id);
    return this.prisma.module.update({
      where: { id },
      data: { title: dto.title, orderIndex: dto.orderIndex },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.module.delete({ where: { id } });
    return { deleted: true, id };
  }

  private async nextOrderIndex(courseId: string): Promise<number> {
    const last = await this.prisma.module.findFirst({
      where: { courseId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });
    return (last?.orderIndex ?? -1) + 1;
  }

  private async ensureExists(id: string): Promise<void> {
    const count = await this.prisma.module.count({ where: { id } });
    if (count === 0) throw new NotFoundException('Module introuvable.');
  }
}
