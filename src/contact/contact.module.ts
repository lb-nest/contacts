import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ContactAssignedToService } from './contact-assigned-to.service';
import { ContactChatService } from './contact-chat.service';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactMailingService } from './contact-mailing.service';

@Module({
  controllers: [ContactController],
  providers: [
    PrismaService,
    ContactAssignedToService,
    ContactChatService,
    ContactHistoryService,
    ContactTagService,
    ContactService,
    ContactMailingService,
  ],
})
export class ContactModule {}
