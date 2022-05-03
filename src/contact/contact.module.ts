import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';

@Module({
  controllers: [ContactController],
  providers: [
    ContactService,
    ContactHistoryService,
    ContactTagService,
    PrismaService,
  ],
})
export class ContactModule {}
