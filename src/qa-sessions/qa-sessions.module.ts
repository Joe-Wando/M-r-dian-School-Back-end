import { Module } from '@nestjs/common';

import { QaSessionsController } from './qa-sessions.controller';
import { QaSessionsService } from './qa-sessions.service';

@Module({
  controllers: [QaSessionsController],
  providers: [QaSessionsService],
})
export class QaSessionsModule {}
