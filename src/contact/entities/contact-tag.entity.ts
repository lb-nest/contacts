import Prisma from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { TagWithoutParentAndChildren } from '../../tag/entities/tag-without-parent-and-children.entity';

export class ContactTag implements Prisma.ContactTag {
  @Exclude()
  contactId: number;

  @Exclude()
  tagId: number;

  @Type(() => TagWithoutParentAndChildren)
  tag: TagWithoutParentAndChildren;
}
