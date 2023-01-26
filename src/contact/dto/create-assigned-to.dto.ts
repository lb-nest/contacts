import { AssigneeType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class CreateAssignedToDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsEnum(AssigneeType)
  type?: AssigneeType;
}
