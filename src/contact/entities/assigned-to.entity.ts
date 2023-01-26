import Prisma from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AssignedTo implements Prisma.AssignedTo {
  @Exclude()
  contactId: number;

  id: number;

  type: Prisma.AssigneeType;
}
