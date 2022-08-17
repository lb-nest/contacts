import { ContactStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class FindAllContactsForUserDto {
  @IsOptional()
  @IsInt()
  assignedTo?: number;

  @IsEnum(ContactStatus)
  status: ContactStatus;
}
