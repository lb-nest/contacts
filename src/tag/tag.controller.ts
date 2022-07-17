import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from 'src/auth/user.decorator';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Tag))
  @Post()
  create(@User() user: any, @Body() createTagDto: CreateTagDto) {
    return this.tagService.create(user.project.id, createTagDto);
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Tag))
  @Get()
  findAll(@User() user: any) {
    return this.tagService.findAll(user.project.id);
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Tag))
  @Get(':id')
  findOne(@User() user: any, @Param('id') id: string) {
    return this.tagService.findOne(user.project.id, Number(id));
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Tag))
  @Patch(':id')
  update(
    @User() user: any,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(user.project.id, Number(id), updateTagDto);
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Tag))
  @Delete(':id')
  delete(@User() user: any, @Param('id') id: string) {
    return this.tagService.delete(user.project.id, Number(id));
  }
}
