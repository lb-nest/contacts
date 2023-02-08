import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactStatus, HistoryEventType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindAllContactsDto } from './dto/find-all-contacts.dto';
import { ImportContactsDto } from './dto/import-contacts.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

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
    { tags, ...createContactDto }: CreateContactDto,
  ): Prisma.PrismaPromise<Contact> {
    return this.prismaService.contact.create({
      data: {
        projectId,
        status: ContactStatus.Open,
        ...createContactDto,
        tags: tags
          ? {
              create: tags.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
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

  findAll(
    projectId: number,
    findAllContactsDto: FindAllContactsDto,
  ): Promise<Contact[]> {
    return this.prismaService.contact.findMany({
      where: {
        projectId,
        deletedAt: null,
        OR:
          findAllContactsDto.query == null
            ? undefined
            : [
                {
                  name: findAllContactsDto.query,
                },
                {
                  chats: {
                    some: {
                      accountId: {
                        contains: findAllContactsDto.query,
                      },
                    },
                  },
                },
              ],
      },
      orderBy: {
        id: 'desc',
      },
      cursor:
        findAllContactsDto.cursor == null
          ? undefined
          : {
              id: findAllContactsDto.cursor,
            },
      skip: findAllContactsDto.cursor == null ? undefined : 1,
      take: findAllContactsDto.take ?? undefined,
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
    { id, tags, assignedTo, ...updateContactDto }: UpdateContactDto,
  ): Promise<Contact> {
    const history = Object.keys(updateContactDto);
    const contact = await this.prismaService.contact.update({
      where: {
        projectId_id: {
          projectId,
          id,
        },
      },
      data: {
        ...updateContactDto,
        assignedTo:
          assignedTo === undefined
            ? undefined
            : assignedTo === null
            ? {
                delete: true,
              }
            : {
                upsert: {
                  create: assignedTo,
                  update: assignedTo,
                },
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

    if (tags) {
      const ids = contact.tags.map(({ tagId }) => tagId);
      await this.prismaService.$transaction([
        this.prismaService.contactTag.createMany({
          data: tags
            .filter((id) => !ids.includes(id))
            .map((tagId) => ({
              tagId,
              contactId: id,
            })),
        }),
        this.prismaService.contactTag.deleteMany({
          where: {
            tagId: {
              in: ids.filter((id) => !tags.includes(id)),
            },
          },
        }),
      ]);

      contact.tags = await this.prismaService.contactTag.findMany({
        where: {
          contactId: contact.id,
        },
        include: {
          tag: true,
        },
      });
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
}
