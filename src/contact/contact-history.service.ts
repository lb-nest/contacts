import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddHistoryDto } from './dto/add-history.dto';
import { History } from './entities/history.entity';

@Injectable()
export class ContactHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(projectId: number, id: number): Promise<History[]> {
    return this.prismaService.history.findMany({
      where: {
        contact: {
          projectId,
          id,
        },
      },
    });
  }

  async create(
    projectId: number,
    id: number,
    addHistoryDto: AddHistoryDto,
  ): Promise<History> {
    return this.prismaService.history.create({
      data: {
        contact: {
          connect: {
            projectId_id: {
              projectId,
              id,
            },
          },
        },
        ...addHistoryDto,
      },
    });
  }
}
