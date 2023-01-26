import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateContactHistoryDto } from './dto/create-contact-history.dto';
import { History } from './entities/history.entity';

@Injectable()
export class ContactHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    projectId: number,
    createContactHistoryDto: CreateContactHistoryDto,
  ): Promise<History> {
    return this.prismaService.history.create({
      data: {
        contact: {
          connect: {
            projectId_id: {
              projectId,
              id: createContactHistoryDto.contactId,
            },
          },
        },
        eventType: createContactHistoryDto.eventType,
        payload: createContactHistoryDto.payload,
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
