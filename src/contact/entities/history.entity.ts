import Prisma from '@prisma/client';
import { Exclude } from 'class-transformer';

export class History implements Prisma.History {
  id: number;

  @Exclude()
  contactId: number;

  eventType: Prisma.HistoryEventType;

  payload: any;

  createdAt: Date;

  updatedAt: Date;
}
