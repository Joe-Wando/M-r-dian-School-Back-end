import { Controller, Get } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /** Sonde de disponibilité (health check pour l'hébergeur). */
  @Get('health')
  async health() {
    let db = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      db = 'unreachable';
    }
    return {
      status: db === 'ok' ? 'ok' : 'degraded',
      service: 'meredian-backend',
      db,
      time: new Date().toISOString(),
    };
  }
}
