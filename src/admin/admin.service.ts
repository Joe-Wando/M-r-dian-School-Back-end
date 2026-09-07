import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /** Statistiques du tableau de bord : cours publiés, ventes, revenu, messages non lus. */
  async stats() {
    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const [
      coursesPublished,
      freeCourses,
      confirmedAgg,
      monthAgg,
      unreadMessages,
      users,
      enrollments,
    ] = await Promise.all([
      this.prisma.course.count(),
      this.prisma.course.count({ where: { isFree: true } }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.confirmed },
        _count: true,
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.confirmed, createdAt: { gte: startOfMonth } },
        _count: true,
        _sum: { amount: true },
      }),
      this.prisma.contactMessage.count({ where: { isRead: false } }),
      this.prisma.user.count(),
      this.prisma.enrollment.count(),
    ]);

    const salesByType = await this.prisma.payment.groupBy({
      by: ['itemType'],
      where: { status: PaymentStatus.confirmed },
      _count: true,
      _sum: { amount: true },
    });

    return {
      coursesPublished,
      freeCourses,
      paidCourses: coursesPublished - freeCourses,
      sales: confirmedAgg._count,
      revenue: confirmedAgg._sum.amount ?? 0,
      salesThisMonth: monthAgg._count,
      revenueThisMonth: monthAgg._sum.amount ?? 0,
      unreadMessages,
      totalUsers: users,
      totalEnrollments: enrollments,
      salesByType: salesByType.map((s) => ({
        itemType: s.itemType,
        count: s._count,
        revenue: s._sum.amount ?? 0,
      })),
    };
  }
}
