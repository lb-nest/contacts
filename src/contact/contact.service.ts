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
      update: {},
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findAll(projectId: number, query: FindContactsDto) {
    return this.prismaService.contact.findMany({
      where: {
        projectId,
        ...query,
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

  async findAllByChatId(projectId: number, chatIds: number[]) {
    return this.prismaService.contact.findMany({
      where: {
        projectId,
        chatId: {
          in: chatIds,
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

  async findOne(projectId: number, id: number): Promise<Contact> {
    return this.prismaService.contact.findUnique({
      where: {
        projectId_id: {
          projectId,
          id,
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
    return this.prismaService.contact.delete({
      where: {
        projectId_id: {
          projectId,
          id,
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

  async countAll(projectId: number, assignedTo: number): Promise<Count> {
    const [assigned, unassigned] = await this.prismaService.$transaction([
      this.prismaService.contact.count({
        where: {
          projectId,
          assignedTo,
          status: ContactStatus.Open,
        },
      }),
      this.prismaService.contact.count({
        where: {
          projectId,
          assignedTo: null,
          status: ContactStatus.Open,
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
