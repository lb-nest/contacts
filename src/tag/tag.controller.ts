import { Controller, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlainToClassInterceptor } from 'src/shared/interceptors/plain-to-class.interceptor';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @MessagePattern('createTag')
  @UseInterceptors(new PlainToClassInterceptor(Tag))
  create(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() createTagDto: CreateTagDto,
  ) {
    return this.tagService.create(projectId, createTagDto);
  }

  @MessagePattern('findAllTags')
  @UseInterceptors(new PlainToClassInterceptor(Tag))
  findAll(@Payload('projectId', ParseIntPipe) projectId: number) {
    return this.tagService.findAll(projectId);
  }

  @MessagePattern('findOneTag')
  @UseInterceptors(new PlainToClassInterceptor(Tag))
  findOne(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('id', ParseIntPipe) id: number,
  ) {
    return this.tagService.findOne(projectId, id);
  }

  @MessagePattern('updateTag')
  @UseInterceptors(new PlainToClassInterceptor(Tag))
  update(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(projectId, updateTagDto);
  }

  @MessagePattern('removeTag')
  @UseInterceptors(new PlainToClassInterceptor(Tag))
  remove(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('id', ParseIntPipe) id: number,
  ) {
    return this.tagService.remove(projectId, id);
  }
}
