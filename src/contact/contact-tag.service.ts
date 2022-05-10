import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HistoryEventType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { TagWithoutParentAndChildren } from '../tag/entities/tag-without-parent-and-children.entity';
import { ContactHistoryService } from './contact-history.service';
import { ContactService } from './contact.service';
import { CreateContactTagDto } from './dto/create-contact-tag.dto';

@Injectable()
export class ContactTagService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly contactService: ContactService,
    private readonly contactHistoryService: ContactHistoryService,
  ) {}

  async findAll(
    projectId: number,
    id: number,
  ): Promise<TagWithoutParentAndChildren[]> {
    try {
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
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async create(
    projectId: number,
    id: number,
    createContactTagDto: CreateContactTagDto,
  ): Promise<TagWithoutParentAndChildren> {
    try {
      const tag = await this.prismaService.contactTag.create({
        data: {
          contact: {
            connect: {
              projectId_id: {
                projectId,
                id,
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

      await this.contactHistoryService.create(projectId, id, {
        eventType: HistoryEventType.TagsChanged,
        payload: {
          eventType: 'add',
          tagId: createContactTagDto.tagId,
        },
      });

      return tag.tag;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async delete(
    projectId: number,
    id: number,
    tagId: number,
  ): Promise<TagWithoutParentAndChildren> {
    const contact = await this.contactService.findOne(projectId, id);
    if (!contact) {
      throw new NotFoundException();
    }

    try {
      const tag = await this.prismaService.contactTag.delete({
        where: {
          tagId_contactId: {
            tagId,
            contactId: id,
          },
        },
        include: {
          tag: true,
        },
      });

      await this.contactHistoryService.create(projectId, id, {
        eventType: HistoryEventType.TagsChanged,
        payload: {
          eventType: 'remove',
          tagId,
        },
      });

      return tag.tag;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
