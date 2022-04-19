import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactStatus, HistoryEventType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AddTagDto } from './dto/add-tag.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(projectId: number, createContactDto: CreateContactDto) {
    return this.prismaService.contact.create({
      data: {
        projectId,
        ...createContactDto,
        status: ContactStatus.Opened,
        history: {
          create: {
            eventType: HistoryEventType.Created,
          },
        },
      },
      select: {
        id: true,
        chatId: true,
        username: true,
        name: true,
        avatarUrl: true,
        status: true,
        assignedTo: true,
      },
    });
  }

  async findAll(projectId: number, chatIds?: number[]) {
    return this.prismaService.contact.findMany({
      where: {
        projectId,
        chatId: {
          in: chatIds,
        },
      },
      select: {
        id: true,
        chatId: true,
        username: true,
        name: true,
        avatarUrl: true,
        status: true,
        assignedTo: true,
      },
    });
  }

  async findOne(projectId: number, id: number) {
    return this.prismaService.contact.findUnique({
      where: {
        projectId_id: {
          projectId,
          id,
        },
      },
      select: {
        id: true,
        chatId: true,
        username: true,
        name: true,
        avatarUrl: true,
        status: true,
        assignedTo: true,
      },
    });
  }

  async update(
    projectId: number,
    id: number,
    updateContactDto: UpdateContactDto,
  ) {
    return this.prismaService.contact.update({
      where: {
        projectId_id: {
          projectId,
          id,
        },
      },
      data: {
        ...updateContactDto,
        history: {
          createMany: {
            data: Object.entries(updateContactDto).map(([key, val]) => ({
              eventType: this.toHistoryEventType(key),
              payload: val,
            })),
          },
        },
      },
      select: {
        id: true,
        chatId: true,
        username: true,
        name: true,
        avatarUrl: true,
        status: true,
        assignedTo: true,
      },
    });
  }

  async delete(projectId: number, id: number) {
    return this.prismaService.contact.delete({
      where: {
        projectId_id: {
          projectId,
          id,
        },
      },
      select: {
        id: true,
        chatId: true,
        username: true,
        name: true,
        avatarUrl: true,
        status: true,
        assignedTo: true,
      },
    });
  }

  async getTags(projectId: number, id: number) {
    return this.prismaService.tag.findMany({
      where: {
        contacts: {
          some: {
            contact: {
              projectId,
              id,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
      },
    });
  }

  async addTag(projectId: number, id: number, addTagDto: AddTagDto) {
    const contact = await this.findOne(projectId, id);
    if (!contact) {
      throw new NotFoundException();
    }

    return this.prismaService.contactTag.create({
      data: {
        contactId: contact.id,
        ...addTagDto,
      },
      select: {
        contact: {
          select: {
            id: true,
          },
        },
        tag: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async delTag(projectId: number, id: number, tagId: number) {
    const contact = await this.findOne(projectId, id);
    if (!contact) {
      throw new NotFoundException();
    }

    return this.prismaService.contactTag.delete({
      where: {
        tagId_contactId: {
          tagId,
          contactId: contact.id,
        },
      },
      select: {
        contact: {
          select: {
            id: true,
          },
        },
        tag: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  private toHistoryEventType(key: string) {
    switch (key) {
      case 'username':
        return HistoryEventType.UsernameChanged;

      case 'name':
        return HistoryEventType.NameChanged;

      case 'notes':
        return HistoryEventType.NotesChanged;
    }
  }
}
