import { IsInt } from 'class-validator';
import { CreateContactDto } from './create-contact.dto';

export class CreateContactForChatDto extends CreateContactDto {
  @IsInt()
  chatId: number;
}
