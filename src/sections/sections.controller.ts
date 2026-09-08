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
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionsService } from './sections.service';

/**
 * Gestion des sections de cours — réservée aux administrateurs.
 */
@ApiTags('Cours (admin)')
@ApiBearerAuth('jwt')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('modules/:moduleId/sections')
  create(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
    @Body() dto: CreateSectionDto,
  ) {
    return this.sectionsService.create(moduleId, dto);
  }

  @Patch('sections/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSectionDto) {
    return this.sectionsService.update(id, dto);
  }

  @Delete('sections/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionsService.remove(id);
  }
}
