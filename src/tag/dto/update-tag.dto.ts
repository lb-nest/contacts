import { PartialType } from '@nestjs/mapped-types';
import { IsInt } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @IsInt()
  id: number;
}
