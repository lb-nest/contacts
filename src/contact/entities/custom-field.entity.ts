import Prisma from '@prisma/client';
import { Exclude } from 'class-transformer';

export class CustomField implements Prisma.CustomField {
  id: number;

  @Exclude()
  contactId: number;

  name: string;

  value: string | null;
}
