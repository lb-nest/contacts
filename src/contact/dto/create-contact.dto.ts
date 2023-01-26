import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateContactDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt({ each: true })
  tags?: number[];
}
