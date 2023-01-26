import { Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { CreateAssignedToDto } from './create-assigned-to.dto';

export class CountAllContactsAssignedToDto {
  @Type(() => CreateAssignedToDto)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  assignedTo?: CreateAssignedToDto;
}
