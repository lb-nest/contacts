import { IsInt } from 'class-validator';

export class CreateContactTagDto {
  @IsInt()
  contactId: number;

  @IsInt()
  tagId: number;
}
