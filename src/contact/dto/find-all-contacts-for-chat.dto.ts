import { IsInt } from 'class-validator';

export class FindAllContactsForChatDto {
  @IsInt({ each: true })
  ids: number[];
}
