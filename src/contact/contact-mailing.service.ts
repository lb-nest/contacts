import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FindAllContactsForMailing } from './dto/find-all-contacts-for-mailing.dto';

@Injectable()
export class ContactMailingService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(
    projectId: number,
    findAllContactsForMailingDto: FindAllContactsForMailing,
  ): Promise<any[]> {
    return this.prismaService.chat.findMany({
      where: {
        channelId: findAllContactsForMailingDto.channelId,
        contact: {
          projectId,
          tags: {
            some: {
              tagId: {
                in: findAllContactsForMailingDto.tagIds,
              },
            },
          },
        },
      },
      select: {
        accountId: true,
        contactId: true,
        contact: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
