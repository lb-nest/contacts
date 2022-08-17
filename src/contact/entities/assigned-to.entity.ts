import Prisma from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AssignedTo implements Prisma.AssignedTo {
  id: number;

  type: Prisma.AssigneeType;

  @Exclude()
  contactId: number;
}
