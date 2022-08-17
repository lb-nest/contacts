import { AssigneeType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class UpdateAssignedToDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsEnum(AssigneeType)
  type?: AssigneeType;
}
