import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateContactDto } from './create-contact.dto';

export class ImportContactsDto {
  @Type(() => CreateContactDto)
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  contacts: CreateContactDto[];
}
