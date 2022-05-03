import { HistoryEventType } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class History {
  id: number;

  @Exclude()
  contactId: number;

  eventType: HistoryEventType;

  payload?: any;

  createdAt: Date;

  updatedAt: Date;
}
