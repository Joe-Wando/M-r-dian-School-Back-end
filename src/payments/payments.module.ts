import { Module } from '@nestjs/common';

import { NaboopayService } from './naboopay.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, NaboopayService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
