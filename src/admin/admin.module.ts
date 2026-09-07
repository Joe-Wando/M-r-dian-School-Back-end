import { Module } from '@nestjs/common';

import { ContactModule } from '../contact/contact.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [ContactModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
