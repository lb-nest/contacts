import { HistoryEventType } from '@prisma/client';
import { IsEnum, IsObject, IsOptional } from 'class-validator';

export class AddHistoryDto {
  @IsEnum(HistoryEventType)
  eventType: HistoryEventType;

  @IsOptional()
  @IsObject()
  payload?: any;
}
