import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  create(projectId: number, createTagDto: CreateTagDto): Promise<Tag> {
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

  findAll(projectId: number): Promise<Tag[]> {
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

  findOne(projectId: number, id: number): Promise<Tag> {
    return this.prismaService.tag.findUnique({
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
  }

  update(
    projectId: number,
    id: number,
    updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    if (id === updateTagDto.parentId) {
      throw new BadRequestException();
    }

    return this.prismaService.tag.update({
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
    });
  }

  delete(projectId: number, id: number): Promise<Tag> {
    return this.prismaService.tag.delete({
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
  }
}
