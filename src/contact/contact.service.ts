import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactStatus, HistoryEventType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindAllContactsDto } from './dto/find-all-contacts.dto';
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
        updatedAt: new Date(),
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

  async findAll(
    projectId: number,
    query: FindAllContactsDto,
  ): Promise<Contact[]> {
    return this.prismaService.contact.findMany({
      where: {
        projectId,
        assignedTo: null,
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
    const contact = await this.prismaService.contact
      .findUnique({
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
      })
      .catch(() => undefined);

    if (!contact || contact.deletedAt) {
      throw new NotFoundException();
    }

    return contact;
  }

  async update(
    projectId: number,
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const events = Object.entries(updateContactDto).filter(([key]) =>
      ['username', 'name', 'notes', 'tags'].includes(key),
    );

    if (updateContactDto.tags) {
      const contact = await this.findOne(projectId, id);
      const ids = contact.tags.map(({ tagId }) => tagId);

      await this.prismaService.$transaction([
        this.prismaService.contactTag.createMany({
          data: updateContactDto.tags
            .filter((id) => !ids.includes(id))
            .map((tagId) => ({
              tagId,
              contactId: id,
            })),
        }),
        this.prismaService.contactTag.deleteMany({
          where: {
            tagId: {
              in: ids.filter((id) => !updateContactDto.tags.includes(id)),
            },
          },
        }),
      ]);
    }

    const contact = await this.prismaService.contact
      .update({
        where: {
          projectId_id: {
            projectId,
            id,
          },
        },
        data: {
          ...updateContactDto,
          tags: {},
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
      })
      .catch(() => undefined);

    if (!contact) {
      throw new NotFoundException();
    }

    return contact;
  }

  async delete(projectId: number, id: number): Promise<Contact> {
    const contact = await this.prismaService.contact.update({
      where: {
        projectId_id: {
          projectId,
          id,
        },
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

    if (!contact) {
      throw new NotFoundException();
    }

    return contact;
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

  private toHistoryEventType(property: string): HistoryEventType {
    switch (property) {
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
