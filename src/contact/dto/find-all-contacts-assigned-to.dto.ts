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
import { CreateAssignedToDto } from './create-assigned-to.dto';

export class FindAllContactsAssignedToDto {
  @Type(() => CreateAssignedToDto)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  assignedTo?: CreateAssignedToDto;

  @IsEnum(ContactStatus)
  status: ContactStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  cursor?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;
}
