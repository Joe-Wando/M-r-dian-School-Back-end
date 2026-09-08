import {
  Body,
  Controller,
  Delete,
  Get,
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
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSkillDto } from './dto/skill.dto';
import { CreateWorkDto } from './dto/work.dto';
import { ProfileService } from './profile.service';

@ApiTags('Vitrine & contact')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /** Vitrine publique. */
  @Get()
  get() {
    return this.profileService.getPublicProfile();
  }

  // --- Administration (rôle vérifié côté serveur) ---

  @Patch()
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(dto);
  }

  @Post('skills')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addSkill(@Body() dto: CreateSkillDto) {
    return this.profileService.addSkill(dto);
  }

  @Delete('skills/:id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeSkill(@Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.removeSkill(id);
  }

  @Post('works')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addWork(@Body() dto: CreateWorkDto) {
    return this.profileService.addWork(dto);
  }

  @Delete('works/:id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeWork(@Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.removeWork(id);
  }
}
