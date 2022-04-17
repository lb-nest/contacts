import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateContactDto {
  @IsInt()
  chatId: number;

  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
