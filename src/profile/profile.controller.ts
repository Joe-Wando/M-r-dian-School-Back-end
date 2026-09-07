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

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSkillDto } from './dto/skill.dto';
import { CreateWorkDto } from './dto/work.dto';
import { ProfileService } from './profile.service';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(dto);
  }

  @Post('skills')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addSkill(@Body() dto: CreateSkillDto) {
    return this.profileService.addSkill(dto);
  }

  @Delete('skills/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeSkill(@Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.removeSkill(id);
  }

  @Post('works')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addWork(@Body() dto: CreateWorkDto) {
    return this.profileService.addWork(dto);
  }

  @Delete('works/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeWork(@Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.removeWork(id);
  }
}
