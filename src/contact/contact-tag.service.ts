import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ContactService } from './contact.service';
import { AddTagDto } from './dto/add-tag.dto';
import { TagWithoutParentAndChildren } from '../tag/entities/tag-without-parent-and-children.entity';

@Injectable()
export class ContactTagService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly contactService: ContactService,
  ) {}

  async findAll(
    projectId: number,
    id: number,
  ): Promise<TagWithoutParentAndChildren[]> {
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
  }

  async create(
    projectId: number,
    id: number,
    addTagDto: AddTagDto,
  ): Promise<TagWithoutParentAndChildren> {
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
              id: addTagDto.tagId,
            },
          },
        },
      },
      include: {
        tag: true,
      },
    });

    return tag.tag;
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

    return tag.tag;
  }
}
