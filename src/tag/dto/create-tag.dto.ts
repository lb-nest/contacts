import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsHexColor,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsHexColor()
  color: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
