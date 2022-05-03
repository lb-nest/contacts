import { Exclude } from 'class-transformer';

export class TagWithoutParentAndChildren {
  id: number;

  @Exclude()
  projectId: number;

  name: string;

  description: string;

  color: string;

  @Exclude()
  parentId?: number;

  createdAt: Date;

  updatedAt: Date;
}
