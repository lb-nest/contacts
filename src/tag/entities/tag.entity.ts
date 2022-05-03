import { Type } from 'class-transformer';
import { TagWithoutParentAndChildren } from './tag-without-parent-and-children.entity';

export class Tag extends TagWithoutParentAndChildren {
  @Type(() => TagWithoutParentAndChildren)
  parent?: TagWithoutParentAndChildren;

  @Type(() => TagWithoutParentAndChildren)
  children: TagWithoutParentAndChildren[];
}
