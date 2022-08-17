import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ContactTagService } from './contact-tag.service';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { HistoryService } from './history.service';

@Module({
  controllers: [ContactController],
  providers: [PrismaService, ContactTagService, ContactService, HistoryService],
})
export class ContactModule {}
