import { Controller, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ContactService } from '../contact/contact.service';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth('jwt')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly contactService: ContactService,
  ) {}

  @Get('stats')
  stats() {
    return this.adminService.stats();
  }

  @Get('contact-messages')
  contactMessages() {
    return this.contactService.list();
  }

  @Patch('contact-messages/:id/read')
  markRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactService.markRead(id);
  }
}
