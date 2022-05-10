import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      return await this.prismaService.contact.upsert({
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
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(
    projectId: number,
    query: FindAllContactsDto,
  ): Promise<Contact[]> {
    try {
      return await this.prismaService.contact.findMany({
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
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAllByChatIds(
    projectId: number,
    chatIds: number[],
  ): Promise<Contact[]> {
    try {
      return await this.prismaService.contact.findMany({
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
    } catch (e) {
      throw new BadRequestException(e);
    }
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

    if (contact.deletedAt) {
      throw new NotFoundException();
    }

    return contact;
  }

  async update(
    projectId: number,
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const events = Object.entries(updateContactDto).filter(([property]) => {
      return ['username', 'name', 'notes'].includes(property);
    });

    await this.findOne(projectId, id);
    try {
      return await this.prismaService.contact.update({
        where: {
          projectId_id: {
            projectId,
            id,
          },
        },
        data: {
          ...updateContactDto,
          history:
            events.length === 0
              ? undefined
              : {
                  createMany: {
                    data: events.map(([property, value]) => ({
                      eventType: this.toHistoryEventType(property),
                      payload: {
                        [property]: value,
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
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async delete(projectId: number, id: number): Promise<Contact> {
    await this.findOne(projectId, id);
    try {
      return await this.prismaService.contact.update({
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
    } catch (e) {
      throw new BadRequestException(e);
    }
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

  private toHistoryEventType(property: string) {
    switch (property) {
      case 'username':
        return HistoryEventType.UsernameChanged;

      case 'name':
        return HistoryEventType.NameChanged;

      case 'notes':
        return HistoryEventType.NotesChanged;
    }
  }
}
