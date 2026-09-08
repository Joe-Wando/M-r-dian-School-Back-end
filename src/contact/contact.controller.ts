import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Vitrine & contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /** Formulaire de contact public. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  submit(@Body() dto: CreateContactDto) {
    return this.contactService.submit(dto);
  }
}
