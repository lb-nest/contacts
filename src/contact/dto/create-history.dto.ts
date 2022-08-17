import { HistoryEventType } from '@prisma/client';
import { IsEnum, IsInt, IsObject, IsOptional } from 'class-validator';

export class CreateHistoryDto {
  @IsInt()
  contactId: number;

  @IsEnum(HistoryEventType)
  eventType: HistoryEventType;

  @IsOptional()
  @IsObject()
  payload?: any;
}
