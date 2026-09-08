import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateWorkSubmissionDto } from './dto/create-work-submission.dto';
import { WorkSubmissionsService } from './work-submissions.service';

@ApiTags('Accompagnement')
@ApiBearerAuth('jwt')
@Controller('work-submissions')
@UseGuards(JwtAuthGuard)
export class WorkSubmissionsController {
  constructor(private readonly workSubmissionsService: WorkSubmissionsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkSubmissionDto,
  ) {
    return this.workSubmissionsService.create(user.id, dto);
  }

  @Get('me')
  mine(@CurrentUser() user: AuthenticatedUser) {
    return this.workSubmissionsService.listForUser(user.id);
  }
}
