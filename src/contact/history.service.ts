import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { History } from './entities/history.entity';

@Injectable()
export class HistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    projectId: number,
    createHistoryDto: CreateHistoryDto,
  ): Promise<History> {
    return this.prismaService.history.create({
      data: {
        contact: {
          connect: {
            projectId_id: {
              projectId,
              id: createHistoryDto.contactId,
            },
          },
        },
        eventType: createHistoryDto.eventType,
        payload: createHistoryDto.payload,
      },
    });
  }

  findAll(projectId: number, contactId: number): Promise<History[]> {
    return this.prismaService.history.findMany({
      where: {
        contact: {
          projectId,
          id: contactId,
        },
      },
    });
  }
}
