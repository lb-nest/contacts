import { PartialType } from '@nestjs/mapped-types';
import { ContactStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateContactDto } from './create-contact.dto';
import { UpdateAssignedToDto } from './update-assigned-to.dto';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsInt()
  id: number;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @Type(() => UpdateAssignedToDto)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  assignedTo?: UpdateAssignedToDto | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;
}
