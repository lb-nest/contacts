import { Injectable } from '@nestjs/common';
import { ContactStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async createForChat(
    projectId: number,
    channelId: number,
    accountId: string,
    { tags = [], ...createContactDto }: CreateContactDto,
  ): Promise<Contact> {
    try {
      const chat = await this.prismaService.chat.upsert({
        where: {
          accountId_channelId: {
            accountId,
            channelId,
          },
        },
        create: {
          accountId,
          channelId,
          contact: {
            create: {
              ...createContactDto,
              projectId,
              status: ContactStatus.Open,
              tags: {
                createMany: {
                  data: tags?.map((tagId) => ({
                    tagId,
                  })),
                },
              },
            },
          },
        },
        update: {
          contact: {
            update: {
              ...createContactDto,
              projectId,
              status: ContactStatus.Open,
              tags: {
                createMany: {
                  data: tags.map((tagId) => ({
                    tagId,
                  })),
                },
              },
            },
          },
        },
        include: {
          contact: {
            include: {
              assignedTo: true,
              customFields: true,
              tags: {
                include: {
                  tag: true,
                },
              },
            },
          },
        },
      });

      return {
        ...chat.contact,
        chats: [chat],
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createChatFor(
    projectId: number,
    id: number,
    channelId: number,
    accountId: string,
  ): Promise<Contact> {
    const chat = await this.prismaService.chat.create({
      data: {
        contact: {
          connect: {
            projectId_id: {
              projectId,
              id,
            },
          },
        },
        channelId,
        accountId,
      },
      include: {
        contact: {
          include: {
            assignedTo: true,
            customFields: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });

    return {
      ...chat.contact,
      chats: [chat],
    };
  }

  async findOne(
    projectId: number,
    channelId: number,
    accountId: string,
  ): Promise<Contact> {
    const chat = await this.prismaService.chat.findFirstOrThrow({
      where: {
        contact: {
          projectId,
        },
        channelId,
        accountId,
      },
      include: {
        contact: {
          include: {
            assignedTo: true,
            customFields: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });

    return {
      ...chat.contact,
      chats: [chat],
    };
  }
}
