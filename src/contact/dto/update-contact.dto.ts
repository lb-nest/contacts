import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ContactStatus } from '@prisma/client';
import { IsArray, IsEnum, IsInt, IsOptional } from 'class-validator';
import { CreateContactDto } from './create-contact.dto';

export class UpdateContactDto extends PartialType(
  OmitType(CreateContactDto, ['avatarUrl']),
) {
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @IsInt()
  assignedTo?: number;

  @IsOptional()
  @IsArray()
  tags?: number[];
}
