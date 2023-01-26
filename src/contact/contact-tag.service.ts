import { Injectable } from '@nestjs/common';
import { HistoryEventType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag-without-parent-and-children.entity';
import { ContactHistoryService } from './contact-history.service';
import { CreateContactTagDto } from './dto/create-contact-tag.dto';
import { RemoveContactTagDto } from './dto/remove-contact-tag.dto';

@Injectable()
export class ContactTagService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly contactHistoryService: ContactHistoryService,
  ) {}

  async create(
    projectId: number,
    createContactTagDto: CreateContactTagDto,
  ): Promise<TagWithoutParentAndChildren> {
    const contactTag = await this.prismaService.contactTag.create({
      data: {
        contact: {
          connect: {
            projectId_id: {
              projectId,
              id: createContactTagDto.contactId,
            },
          },
        },
        tag: {
          connect: {
            projectId_id: {
              projectId,
              id: createContactTagDto.tagId,
            },
          },
        },
      },
      include: {
        tag: true,
      },
    });

    await this.contactHistoryService.create(projectId, {
      contactId: createContactTagDto.contactId,
      eventType: HistoryEventType.Update,
      payload: {
        tagId: createContactTagDto.tagId,
      },
    });

    return contactTag.tag;
  }

  findAll(
    projectId: number,
    contactId: number,
  ): Promise<TagWithoutParentAndChildren[]> {
    return this.prismaService.tag.findMany({
      where: {
        contacts: {
          some: {
            contact: {
              projectId,
              id: contactId,
            },
          },
        },
      },
    });
  }

  async remove(
    projectId: number,
    removeContactTagDto: RemoveContactTagDto,
  ): Promise<TagWithoutParentAndChildren> {
    const contactTag = await this.prismaService.contactTag.delete({
      where: {
        tagId_contactId: removeContactTagDto,
      },
      include: {
        tag: true,
      },
    });

    await this.contactHistoryService.create(projectId, {
      contactId: removeContactTagDto.contactId,
      eventType: HistoryEventType.Update,
      payload: {
        tagId: removeContactTagDto.tagId,
      },
    });

    return contactTag.tag;
  }
}
