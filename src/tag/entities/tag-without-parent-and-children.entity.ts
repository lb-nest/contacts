import Prisma from '@prisma/client';
import { Exclude } from 'class-transformer';

export class TagWithoutParentAndChildren implements Prisma.Tag {
  id: number;

  @Exclude()
  projectId: number;

  name: string;

  description: string;

  color: string;

  @Exclude()
  parentId: number | null;

  createdAt: Date;

  updatedAt: Date;
}
