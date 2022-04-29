import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { ContactService } from './contact.service';
import { AddHistoryDto } from './dto/add-history.dto';
import { AddTagDto } from './dto/add-tag.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // TODO: Использовать аутентификацию на основе токенов сервисов
  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@User() user: any, @Query('chatIds') chatIds?: string) {
    return this.contactService.findAll(
      user.project.id,
      chatIds?.split(',').map(Number),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('count')
  countAll(@User() user: any) {
    return this.contactService.countAll(user.project.id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@User() user: any, @Param('id') id: string) {
    return this.contactService.findOne(user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @User() user: any,
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactService.update(
      user.project.id,
      Number(id),
      updateContactDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@User() user: any, @Param('id') id: string) {
    return this.contactService.delete(user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/tags')
  getTags(@User() user: any, @Param('id') id: string) {
    return this.contactService.getTags(user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/tags')
  addTag(
    @User() user: any,
    @Param('id') id: string,
    @Body() addTagDto: AddTagDto,
  ) {
    return this.contactService.addTag(user.project.id, Number(id), addTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/tags/:tagId')
  delTag(
    @User() user: any,
    @Param('id') id: string,
    @Param('tagId') tagId: string,
  ) {
    return this.contactService.delTag(
      user.project.id,
      Number(id),
      Number(tagId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/history')
  getHistory(@User() user: any, @Param('id') id: string) {
    return this.contactService.getHistory(user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/history')
  addHistory(
    @User() user: any,
    @Param('id') id: string,
    @Body() addHistoryDto: AddHistoryDto,
  ) {
    return this.contactService.addHistory(
      user.project.id,
      Number(id),
      addHistoryDto,
    );
  }
}
