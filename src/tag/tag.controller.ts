import {
  Controller,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Auth } from 'src/auth/auth.decorator';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { TokenPayload } from 'src/auth/entities/token-payload.entity';
import { PlainToClassInterceptor } from 'src/shared/interceptors/plain-to-class.interceptor';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @MessagePattern('tags.create')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Tag))
  create(
    @Auth() auth: TokenPayload,
    @Payload('payload') createTagDto: CreateTagDto,
  ) {
    return this.tagService.create(auth.project.id, createTagDto);
  }

  @MessagePattern('tags.findAll')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Tag))
  findAll(@Auth() auth: TokenPayload) {
    return this.tagService.findAll(auth.project.id);
  }

  @MessagePattern('tags.findOne')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Tag))
  findOne(
    @Auth() auth: TokenPayload,
    @Payload('payload', ParseIntPipe) id: number,
  ) {
    return this.tagService.findOne(auth.project.id, id);
  }

  @MessagePattern('tags.update')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Tag))
  update(
    @Auth() auth: TokenPayload,
    @Payload('payload') updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(auth.project.id, updateTagDto);
  }

  @MessagePattern('tags.remove')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Tag))
  remove(
    @Auth() auth: TokenPayload,
    @Payload('payload', ParseIntPipe) id: number,
  ) {
    return this.tagService.remove(auth.project.id, id);
  }
}
