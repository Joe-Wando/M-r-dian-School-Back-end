import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EnrollmentsService } from '../enrollments/enrollments.service';

@ApiTags('Progression')
@ApiBearerAuth('jwt')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  /** Cours suivis par l'utilisateur connecté + progression. */
  @Get('me/courses')
  myCourses(@CurrentUser() user: AuthenticatedUser) {
    return this.enrollmentsService.listUserCourses(user.id);
  }
}
