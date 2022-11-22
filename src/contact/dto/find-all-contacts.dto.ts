import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FindAllContactsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  cursor?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  query?: string;
}
