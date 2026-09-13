import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { createReadStream } from 'node:fs';

import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateWorkSubmissionDto } from './dto/create-work-submission.dto';
import { ReviewWorkSubmissionDto } from './dto/review-work-submission.dto';
import { buildMulterOptions } from './multer.config';
import { WorkSubmissionsService } from './work-submissions.service';

@ApiTags('Accompagnement')
@ApiBearerAuth('jwt')
@Controller('work-submissions')
@UseGuards(JwtAuthGuard)
export class WorkSubmissionsController {
  constructor(private readonly workSubmissionsService: WorkSubmissionsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', buildMulterOptions('work-submissions')))
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkSubmissionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Un fichier est requis.');
    return this.workSubmissionsService.create(user.id, dto, file);
  }

  @Get('me')
  mine(@CurrentUser() user: AuthenticatedUser) {
    return this.workSubmissionsService.listForUser(user.id);
  }

  @Get('admin')
  @ApiTags('Admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  listAll() {
    return this.workSubmissionsService.listAllForAdmin();
  }

  @Patch(':id/review')
  @ApiTags('Admin')
  @ApiConsumes('multipart/form-data')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('feedbackFile', buildMulterOptions('work-submissions/feedback')))
  review(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReviewWorkSubmissionDto,
    @UploadedFile() feedbackFile?: Express.Multer.File,
  ) {
    return this.workSubmissionsService.review(id, dto, feedbackFile);
  }

  @Get(':id/download')
  async downloadOriginal(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    return this.stream(id, user, 'original', res);
  }

  @Get(':id/download/feedback')
  async downloadFeedback(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    return this.stream(id, user, 'feedback', res);
  }

  private async stream(
    id: string,
    user: AuthenticatedUser,
    variant: 'original' | 'feedback',
    res: Response,
  ): Promise<StreamableFile> {
    const { absolutePath, downloadName } = await this.workSubmissionsService.getFileForDownload(
      id,
      user,
      variant,
    );
    res.set({
      'Content-Disposition': `attachment; filename="${encodeURIComponent(downloadName)}"`,
    });
    return new StreamableFile(createReadStream(absolutePath));
  }
}
