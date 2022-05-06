import { Injectable } from '@nestjs/common';
import { ContactStatus, HistoryEventType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindContactsDto } from './dto/find-contacts.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { Count } from './entities/count.entity';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    projectId: number,
    createContactDto: CreateContactDto,
  ): Promise<Contact> {
    return this.prismaService.contact.upsert({
      where: {
        chatId: createContactDto.chatId,
      },
      create: {
        projectId,
        status: ContactStatus.Open,
        ...createContactDto,
        history: {
          create: {
            eventType: HistoryEventType.Created,
          },
        },
      },
      update: {
        deletedAt: null,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findAll(projectId: number, query: FindContactsDto): Promise<Contact[]> {
    return this.prismaService.contact.findMany({
      where: {
        projectId,
        ...query,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findAllByChatIds(
    projectId: number,
    chatIds: number[],
  ): Promise<Contact[]> {
    return this.prismaService.contact.findMany({
      where: {
        projectId,
        chatId: {
          in: chatIds,
        },
        deletedAt: null,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findOne(projectId: number, id: number): Promise<Contact> {
    return this.prismaService.contact.findUnique({
      where: {
        projectId_id: {
          projectId,
          id,
        },
        // TODO: deletedAt
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async update(
    projectId: number,
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const { tags, ...data } = updateContactDto;

    const events = Object.entries(updateContactDto).filter(
      ([key]) => !['assignedTo', 'status'].includes(key),
    );

    return this.prismaService.contact.update({
      where: {
        projectId_id: {
          projectId,
          id,
        },
        // TODO: deletedAt
      },
      data: {
        ...data,
        tags: tags && {
          createMany: {
            data: tags?.map((tagId) => ({ tagId })),
          },
        },
        history:
          events.length === 0
            ? undefined
            : {
                createMany: {
                  data: events.map(([key, val]) => ({
                    eventType: this.toHistoryEventType(key),
                    payload: {
                      [key]: val,
                    },
                  })),
                },
              },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async delete(projectId: number, id: number): Promise<Contact> {
    return this.prismaService.contact.update({
      where: {
        projectId_id: {
          projectId,
          id,
        },
        // TODO: deletedAt
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async countAll(projectId: number, assignedTo: number): Promise<Count> {
    const [assigned, unassigned] = await this.prismaService.$transaction([
      this.prismaService.contact.count({
        where: {
          projectId,
          assignedTo,
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

  private toHistoryEventType(key: string) {
    switch (key) {
      case 'username':
        return HistoryEventType.UsernameChanged;

      case 'name':
        return HistoryEventType.NameChanged;

      case 'notes':
        return HistoryEventType.NotesChanged;

      case 'tags':
        return HistoryEventType.TagsChanged;
    }
  }
}
