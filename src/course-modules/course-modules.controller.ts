import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CourseModulesService } from './course-modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

/**
 * Gestion des modules de cours — réservée aux administrateurs.
 * (Rôle vérifié côté serveur via JwtAuthGuard + RolesGuard.)
 */
@ApiTags('Cours (admin)')
@ApiBearerAuth('jwt')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class CourseModulesController {
  constructor(private readonly modulesService: CourseModulesService) {}

  @Post('courses/:courseId/modules')
  create(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() dto: CreateModuleDto,
  ) {
    return this.modulesService.create(courseId, dto);
  }

  @Patch('modules/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(id, dto);
  }

  @Delete('modules/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.modulesService.remove(id);
  }
}
