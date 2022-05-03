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
import { Auth } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Tag))
  @Post()
  create(@Auth() user: any, @Body() createTagDto: CreateTagDto) {
    return this.tagService.create(user.project.id, createTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Tag))
  @Get()
  findAll(@Auth() user: any) {
    return this.tagService.findAll(user.project.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Tag))
  @Get(':id')
  findOne(@Auth() user: any, @Param('id') id: string) {
    return this.tagService.findOne(user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Tag))
  @Patch(':id')
  update(
    @Auth() user: any,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(user.project.id, Number(id), updateTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Tag))
  @Delete(':id')
  delete(@Auth() user: any, @Param('id') id: string) {
    return this.tagService.delete(user.project.id, Number(id));
  }
}
