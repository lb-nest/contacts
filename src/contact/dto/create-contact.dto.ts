import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsOptional()
  name?: string;

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
