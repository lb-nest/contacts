import Prisma from '@prisma/client';
import { Exclude } from 'class-transformer';

export class Chat implements Prisma.Chat {
  @Exclude()
  contactId: number;

  accountId: string;

  channelId: number | null;
}
