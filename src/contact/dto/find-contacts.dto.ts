import { ContactStatus } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class FindContactsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }: TransformFnParams) => value && Number(value))
  assignedTo?: number;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}
