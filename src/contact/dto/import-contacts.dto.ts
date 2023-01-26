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
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  contacts: CreateContactDto[];
}
