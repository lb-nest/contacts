import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  create(projectId: number, createTagDto: CreateTagDto) {
    return this.prismaService.tag.create({
      data: {
        projectId,
        ...createTagDto,
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        parent: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findAll(projectId: number) {
    return this.prismaService.tag.findMany({
      where: {
        projectId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        parent: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findOne(projectId: number, id: number) {
    return this.prismaService.tag.findUnique({
      where: {
        projectId_id: {
          projectId,
          id,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        parent: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  update(projectId: number, id: number, updateTagDto: UpdateTagDto) {
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
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        parent: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  delete(projectId: number, id: number) {
    return this.prismaService.tag.delete({
      where: {
        projectId_id: {
          projectId,
          id,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        parent: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
          },
        },
      },
    });
  }
}
