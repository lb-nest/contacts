import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateContactDto {
  @IsOptional()
  @IsString()
  telegramId?: string;

  @Transform(({ value }) => value.replace(/[^0-9]/gim, ''))
  @IsOptional()
  @IsString()
  whatsappId?: string;

  @IsOptional()
  @IsString()
  webchatId?: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt({ each: true })
  tags?: number[];
}
