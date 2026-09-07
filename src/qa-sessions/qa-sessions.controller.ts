import {
  Body,
  Controller,
  Get,
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
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateQaSessionDto } from './dto/create-qa-session.dto';
import { QaSessionsService } from './qa-sessions.service';

@Controller('qa-sessions')
export class QaSessionsController {
  constructor(private readonly qaSessionsService: QaSessionsService) {}

  /** Sessions Q&R à venir (public). */
  @Get()
  findUpcoming() {
    return this.qaSessionsService.findUpcoming();
  }

  /** Inscription à une session (utilisateur connecté). */
  @Post(':id/register')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  register(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.qaSessionsService.register(user.id, id);
  }

  /** Création d'une session (admin — hors liste initiale, ajouté pour la gestion). */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateQaSessionDto) {
    return this.qaSessionsService.create(dto);
  }
}
