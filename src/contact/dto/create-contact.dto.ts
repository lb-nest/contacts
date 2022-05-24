import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateContactDto {
  @IsInt()
  chatId: number;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  username: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
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
