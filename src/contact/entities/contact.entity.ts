import { ContactStatus } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { Tags } from './tags.entity';

export class Contact {
  id: number;

  @Exclude()
  projectId: number;

  chatId: number;

  username: string;

  name: string;

  avatarUrl?: string;

  status: ContactStatus;

  assignedTo?: number;

  notes: string;

  priority: number;

  resolved: boolean;

  @Type(() => Tags)
  tags: Tags[];

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
