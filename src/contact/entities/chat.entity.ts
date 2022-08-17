import Prisma from '@prisma/client';
import { Exclude } from 'class-transformer';

export class Chat implements Prisma.Chat {
  id: number;

  @Exclude()
  contactId: number;
}
