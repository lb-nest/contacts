import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateContactDto } from './create-contact.dto';

export class ImportContactsDto {
  @Type(() => CreateContactDto)
  @ValidateNested({ each: true })
  contacts: CreateContactDto[];
}
