import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(projectId: number, createTagDto: CreateTagDto): Promise<Tag> {
    return this.prismaService.tag.create({
      data: {
        projectId,
        ...createTagDto,
      },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findAll(projectId: number): Promise<Tag[]> {
    return this.prismaService.tag.findMany({
      where: {
        projectId,
      },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findOne(projectId: number, id: number): Promise<Tag> {
    const tag = await this.prismaService.tag.findUnique({
      where: {
        projectId_id: {
          projectId,
          id,
        },
      },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!tag) {
      throw new NotFoundException();
    }

    return tag;
  }

  async update(
    projectId: number,
    id: number,
    updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    if (id === updateTagDto.parentId) {
      throw new BadRequestException();
    }

    const tag = await this.prismaService.tag
      .update({
        where: {
          projectId_id: {
            projectId,
            id,
          },
        },
        data: updateTagDto,
        include: {
          parent: true,
          children: true,
        },
      })
      .catch(() => undefined);

    if (!tag) {
      throw new NotFoundException();
    }

    return tag;
  }

  async delete(projectId: number, id: number): Promise<Tag> {
    const tag = await this.prismaService.tag
      .delete({
        where: {
          projectId_id: {
            projectId,
            id,
          },
        },
        include: {
          parent: true,
          children: true,
        },
      })
      .catch(() => undefined);

    if (!tag) {
      throw new NotFoundException();
    }

    return tag;
  }
}
