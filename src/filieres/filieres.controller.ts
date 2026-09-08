import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateFiliereDto } from './dto/update-filiere.dto';
import { FilieresService } from './filieres.service';

@ApiTags('Catalogue')
@Controller('filieres')
export class FilieresController {
  constructor(private readonly filieresService: FilieresService) {}

  /** Contenu des bandeaux par matière (public). */
  @Get()
  findAll() {
    return this.filieresService.findAll();
  }

  @Get(':category')
  findOne(@Param('category') category: string) {
    return this.filieresService.findOne(category);
  }

  /** Édition du contenu d'une filière (admin — rôle vérifié côté serveur). */
  @Patch(':category')
  @ApiTags('Filières (admin)')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('category') category: string, @Body() dto: UpdateFiliereDto) {
    return this.filieresService.update(category, dto);
  }
}
