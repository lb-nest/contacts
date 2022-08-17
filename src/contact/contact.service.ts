import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactStatus, HistoryEventType, PrismaPromise } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateChatForContactDto } from './dto/create-chat-for-contact.dto';
import { CreateContactForChatDto } from './dto/create-contact-for-chat.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindAllContactsForChatDto } from './dto/find-all-contacts-for-chat.dto';
import { FindAllContactsForUserDto } from './dto/find-all-contacts-for-user.dto';
import { ImportContactsDto } from './dto/import-contacts.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { CountAllContacts } from './entities/count-all-contacts.entity';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}

  async import(
    projectId: number,
    importContactsDto: ImportContactsDto,
  ): Promise<boolean> {
    await this.prismaService.$transaction(
      importContactsDto.contacts.map((createContactDto) =>
        this.create(projectId, createContactDto),
      ),
    );

    return true;
  }

  create(
    projectId: number,
    createContactDto: CreateContactDto,
  ): PrismaPromise<Contact> {
    return this.prismaService.contact.create({
      data: {
        projectId,
        status: ContactStatus.Open,
        ...createContactDto,
        history: {
          create: {
            eventType: HistoryEventType.Create,
          },
        },
      },
      include: {
        assignedTo: true,
        customFields: true,
        tags: {
          include: {
            tag: true,
          },
        },
        chats: true,
      },
    });
  }

  async createForChat(
    projectId: number,
    createContactForChatDto: CreateContactForChatDto,
  ): Promise<Contact> {
    const { chatId, ...createContactDto } = createContactForChatDto;

    const chat = await this.prismaService.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (chat) {
      return this.prismaService.contact.update({
        where: {
          id: chat.contactId,
        },
        data: {
          ...createContactDto,
          deletedAt: null,
          updatedAt: new Date(),
        },
        include: {
          assignedTo: true,
          customFields: true,
          tags: {
            include: {
              tag: true,
            },
          },
          chats: true,
        },
      });
    }

    return this.prismaService.contact.create({
      data: {
        projectId,
        status: ContactStatus.Open,
        ...createContactDto,
        chats: {
          create: {
            id: chatId,
          },
        },
        history: {
          create: {
            eventType: HistoryEventType.Create,
          },
        },
      },
      include: {
        assignedTo: true,
        customFields: true,
        tags: {
          include: {
            tag: true,
          },
        },
        chats: true,
      },
    });
  }

  findAll(projectId: number): Promise<Contact[]> {
    return this.prismaService.contact.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        assignedTo: true,
        customFields: true,
        tags: {
          include: {
            tag: true,
          },
        },
        chats: true,
      },
    });
  }

  findAllForUser(
    projectId: number,
    userId: number,
    findAllContactsForUserDto: FindAllContactsForUserDto,
  ): Promise<Contact[]> {
    return this.prismaService.contact.findMany({
      where: {
        projectId,
        assignedTo:
          findAllContactsForUserDto.assignedTo === userId
            ? {
                id: findAllContactsForUserDto.assignedTo,
              }
            : undefined,
        status: findAllContactsForUserDto.status,
        deletedAt: null,
      },
      include: {
        assignedTo: true,
        customFields: true,
        tags: {
          include: {
            tag: true,
          },
        },
        chats: true,
      },
    });
  }

  findAllForChat(
    projectId: number,
    findAllContactsForChatDto: FindAllContactsForChatDto,
  ): Promise<Contact[]> {
    return this.prismaService.contact.findMany({
      where: {
        projectId,
        chats: {
          some: {
            id: {
              in: findAllContactsForChatDto.ids,
            },
          },
        },
        deletedAt: null,
      },
      include: {
        assignedTo: true,
        customFields: true,
        tags: {
          include: {
            tag: true,
          },
        },
        chats: true,
      },
    });
  }

  async countAllForUser(
    projectId: number,
    userId: number,
  ): Promise<CountAllContacts> {
    const [assigned, unassigned] = await this.prismaService.$transaction([
      this.prismaService.contact.count({
        where: {
          projectId,
          assignedTo: {
            id: userId,
          },
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

  async findOne(projectId: number, id: number): Promise<Contact> {
    const contact = await this.prismaService.contact.findUniqueOrThrow({
      where: {
        projectId_id: {
          projectId,
          id,
        },
      },
      include: {
        assignedTo: true,
        customFields: true,
        tags: {
          include: {
            tag: true,
          },
        },
        chats: true,
      },
    });

    if (contact.deletedAt) {
      throw new NotFoundException();
    }

    return contact;
  }

  async update(
    projectId: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const history = Object.keys(updateContactDto);
    const contact = await this.prismaService.contact.update({
      where: {
        projectId_id: {
          projectId,
          id: updateContactDto.id,
        },
      },
      data: {
        ...updateContactDto,
        assignedTo:
          updateContactDto.assignedTo === undefined
            ? undefined
            : updateContactDto.assignedTo === null
            ? {
                delete: true,
              }
            : {
                create: updateContactDto.assignedTo,
              },
        history: history.length
          ? undefined
          : {
              createMany: {
                data: history.map((key) => ({
                  eventType: HistoryEventType.Update,
                  payload: {
                    [key]: updateContactDto[key],
                  },
                })),
              },
            },
      },
      include: {
        assignedTo: true,
        customFields: true,
        tags: {
          include: {
            tag: true,
          },
        },
        chats: true,
      },
    });

    if (updateContactDto.tags) {
      const ids = contact.tags.map(({ tagId }) => tagId);
      await this.prismaService.$transaction([
        this.prismaService.contactTag.createMany({
          data: updateContactDto.tags
            .filter((id) => !ids.includes(id))
            .map((tagId) => ({
              tagId,
              contactId: updateContactDto.id,
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

    return contact;
  }

  remove(projectId: number, id: number): Promise<Contact> {
    return this.prismaService.contact.update({
      where: {
        projectId_id: {
          projectId,
          id,
        },
      },
      data: {
        deletedAt: new Date(),
        history: {
          create: {
            eventType: HistoryEventType.Remove,
          },
        },
      },
      include: {
        assignedTo: true,
        customFields: true,
        tags: {
          include: {
            tag: true,
          },
        },
        chats: true,
      },
    });
  }

  async createChatForContact(
    projectId: number,
    createChatForContactDto: CreateChatForContactDto,
  ): Promise<boolean> {
    await this.prismaService.contact.update({
      where: {
        projectId_id: {
          projectId,
          id: createChatForContactDto.id,
        },
      },
      data: {
        chats: {
          create: {
            id: createChatForContactDto.chatId,
          },
        },
      },
    });

    return true;
  }
}
