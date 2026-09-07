import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { ContactModule } from './contact/contact.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { HealthController } from './health.controller';
import { MentoringModule } from './mentoring/mentoring.module';
import { CourseModulesModule } from './modules/course-modules.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { QaSessionsModule } from './qa-sessions/qa-sessions.module';
import { SectionsModule } from './sections/sections.module';
import { UsersModule } from './users/users.module';
import { WorkSubmissionsModule } from './work-submissions/work-submissions.module';

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
    EnrollmentsModule,
    UsersModule,
    PaymentsModule,
    MentoringModule,
    QaSessionsModule,
    WorkSubmissionsModule,
    ProfileModule,
    ContactModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
