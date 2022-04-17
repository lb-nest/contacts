import { IsHexColor, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
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
