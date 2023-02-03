import { IsInt } from 'class-validator';

export class FindAllContactsForMailing {
  @IsInt({ each: true })
  tagIds: number[];

  @IsInt()
  channelId: number;
}
