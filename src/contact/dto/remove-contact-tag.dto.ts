import { IsInt } from 'class-validator';

export class RemoveContactTagDto {
  @IsInt()
  contactId: number;

  @IsInt()
  tagId: number;
}
