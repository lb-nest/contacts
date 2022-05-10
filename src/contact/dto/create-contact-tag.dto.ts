import { IsInt } from 'class-validator';

export class CreateContactTagDto {
  @IsInt()
  tagId: number;
}
