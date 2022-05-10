import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { History } from './entities/history.entity';

@Injectable()
export class ContactHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(projectId: number, id: number): Promise<History[]> {
    try {
      return await this.prismaService.history.findMany({
        where: {
          contact: {
            projectId,
            id,
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
    createHistoryDto: CreateHistoryDto,
  ): Promise<History> {
    try {
      return await this.prismaService.history.create({
        data: {
          contact: {
            connect: {
              projectId_id: {
                projectId,
                id,
              },
            },
          },
          ...createHistoryDto,
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
