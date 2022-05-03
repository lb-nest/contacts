import { Exclude, Type } from 'class-transformer';
import { TagWithoutParentAndChildren } from '../../tag/entities/tag-without-parent-and-children.entity';

export class Tags {
  @Exclude()
  contactId: number;

  @Exclude()
  tagId: number;

  @Type(() => TagWithoutParentAndChildren)
  tag: TagWithoutParentAndChildren;
}
