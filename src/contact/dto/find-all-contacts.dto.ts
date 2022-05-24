import { ContactStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class FindAllContactsDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) =>
    value === 'all' ? undefined : value && Number(value),
  )
  assignedTo?: number;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}
