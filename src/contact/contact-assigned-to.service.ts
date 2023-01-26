import { Injectable } from '@nestjs/common';
import { ContactStatus } from '@prisma/client';
import { Contact } from 'src/contact/entities/contact.entity';
import { PrismaService } from 'src/prisma.service';
import { CountAllContactsAssignedToDto } from './dto/count-all-contacts-assigned-to.dto';
import { FindAllContactsAssignedToDto } from './dto/find-all-contacts-assigned-to.dto';
import { CountAllContactsAssignedTo } from './entities/count-all-contacts-assigned-to.entity';

@Injectable()
export class ContactAssignedToService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(
    projectId: number,
    findAllContactsAssignedToDto: FindAllContactsAssignedToDto,
  ): Promise<Contact[]> {
    return this.prismaService.contact.findMany({
      where: {
        projectId,
        assignedTo: findAllContactsAssignedToDto.assignedTo ?? {
          is: null,
        },
        status: findAllContactsAssignedToDto.status,
        deletedAt: null,
        chats: {
          some: {
            channelId: {
              not: null,
            },
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
      cursor:
        findAllContactsAssignedToDto.cursor == null
          ? undefined
          : {
              id: findAllContactsAssignedToDto.cursor,
            },
      skip: findAllContactsAssignedToDto.cursor == null ? undefined : 1,
      take: findAllContactsAssignedToDto.take ?? undefined,
      include: {
        assignedTo: true,
        customFields: true,
        tags: {
          include: {
            tag: true,
          },
        },
        chats: {
          where: {
            channelId: {
              not: null,
            },
          },
        },
      },
    });
  }

  async countAll(
    projectId: number,
    countAllContactsAssignedToDto: CountAllContactsAssignedToDto,
  ): Promise<CountAllContactsAssignedTo> {
    const [assigned, unassigned] = await this.prismaService.$transaction([
      this.prismaService.contact.count({
        where: {
          projectId,
          assignedTo: countAllContactsAssignedToDto.assignedTo,
          status: ContactStatus.Open,
          deletedAt: null,
        },
      }),
      this.prismaService.contact.count({
        where: {
          projectId,
          assignedTo: null,
          status: ContactStatus.Open,
          deletedAt: null,
        },
      }),
    ]);

    return {
      assigned,
      unassigned,
    };
  }
}
