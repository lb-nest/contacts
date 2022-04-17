import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  controllers: [TagController],
  providers: [PrismaService, TagService],
})
export class TagModule {}
