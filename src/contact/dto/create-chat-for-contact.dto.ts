import { IsInt } from 'class-validator';

export class CreateChatForContactDto {
  @IsInt()
  id: number;

  @IsInt()
  chatId: number;
}
