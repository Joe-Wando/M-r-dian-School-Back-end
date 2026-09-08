import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';

/** Progression — routes réservées à l'utilisateur connecté. */
@ApiTags('Progression')
@ApiBearerAuth('jwt')
@Controller()
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('courses/:id/enroll')
  @HttpCode(HttpStatus.CREATED)
  enroll(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) courseId: string,
  ) {
    return this.enrollmentsService.enroll(user.id, courseId);
  }

  @Post('sections/:id/complete')
  @HttpCode(HttpStatus.OK)
  complete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) sectionId: string,
  ) {
    return this.enrollmentsService.completeSection(user.id, sectionId);
  }
}
