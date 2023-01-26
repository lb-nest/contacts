import { HistoryEventType } from '@prisma/client';
import { IsEnum, IsInt, IsObject, IsOptional } from 'class-validator';

export class CreateContactHistoryDto {
  @IsInt()
  contactId: number;

  @IsEnum(HistoryEventType)
  eventType: HistoryEventType;

  @IsOptional()
  @IsObject()
  payload?: any;
}
