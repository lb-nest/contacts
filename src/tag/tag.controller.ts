import { Controller, ParseIntPipe, SerializeOptions } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@SerializeOptions({
  type: Tag,
})
@Controller()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @MessagePattern('createTag')
  create(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() createTagDto: CreateTagDto,
  ): Promise<Tag> {
    return this.tagService.create(projectId, createTagDto);
  }

  @MessagePattern('findAllTags')
  findAll(
    @Payload('projectId', ParseIntPipe) projectId: number,
  ): Promise<Tag[]> {
    return this.tagService.findAll(projectId);
  }

  @MessagePattern('findOneTag')
  findOne(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<Tag> {
    return this.tagService.findOne(projectId, id);
  }

  @MessagePattern('updateTag')
  update(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagService.update(projectId, updateTagDto);
  }

  @MessagePattern('removeTag')
  remove(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<Tag> {
    return this.tagService.remove(projectId, id);
  }
}
