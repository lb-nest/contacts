import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() user: any, @Body() createTagDto: CreateTagDto) {
    return this.tagService.create(user.project.id, createTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@User() user: any) {
    return this.tagService.findAll(user.project.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@User() user: any, @Param('id') id: string) {
    return this.tagService.findOne(user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @User() user: any,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(user.project.id, Number(id), updateTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@User() user: any, @Param('id') id: string) {
    return this.tagService.delete(user.project.id, Number(id));
  }
}
