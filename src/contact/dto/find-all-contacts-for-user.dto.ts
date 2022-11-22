import { ContactStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { FindAllContactsDto } from './find-all-contacts.dto';

export class FindAllContactsForUserDto extends FindAllContactsDto {
  @IsOptional()
  @IsInt()
  assignedTo?: number;

  @IsEnum(ContactStatus)
  status: ContactStatus;
}
