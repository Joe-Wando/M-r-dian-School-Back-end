import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { CoursesModule } from './courses/courses.module';
import { HealthController } from './health.controller';
import { CourseModulesModule } from './modules/course-modules.module';
import { PrismaModule } from './prisma/prisma.module';
import { SectionsModule } from './sections/sections.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    CoursesModule,
    CourseModulesModule,
    SectionsModule,
    // Les modules de domaine sont enregistrés au fil des fonctionnalités.
  ],
  controllers: [HealthController],
})
export class AppModule {}
