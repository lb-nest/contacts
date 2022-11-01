import { IsInt } from 'class-validator';

export class FindOneContactForChatDto {
  @IsInt({ each: true })
  ids: number[];
}
