import { Module } from '@nestjs/common';

import { WorkSubmissionsController } from './work-submissions.controller';
import { WorkSubmissionsService } from './work-submissions.service';

@Module({
  controllers: [WorkSubmissionsController],
  providers: [WorkSubmissionsService],
})
export class WorkSubmissionsModule {}
