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
        children: true,
        parent: true,
      },
    });
  }

  findAll(projectId: number): Promise<Tag[]> {
    return this.prismaService.tag.findMany({
      where: {
        projectId,
      },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  findOne(projectId: number, id: number): Promise<Tag> {
    return this.prismaService.tag.findUniqueOrThrow({
      where: {
        projectId_id: {
          projectId,
          id,
        },
      },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  update(projectId: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    if (updateTagDto.id === updateTagDto.parentId) {
      throw new BadRequestException();
    }

    return this.prismaService.tag.update({
      where: {
        projectId_id: {
          projectId,
          id: updateTagDto.id,
        },
      },
      data: updateTagDto,
      include: {
        children: true,
        parent: true,
      },
    });
  }

  remove(projectId: number, id: number): Promise<Tag> {
    return this.prismaService.tag.delete({
      where: {
        projectId_id: {
          projectId,
          id,
        },
      },
      include: {
        children: true,
        parent: true,
      },
    });
  }
}
