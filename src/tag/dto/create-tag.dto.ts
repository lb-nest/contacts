import { Transform } from 'class-transformer';
import {
  IsHexColor,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTagDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsHexColor()
  color: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
