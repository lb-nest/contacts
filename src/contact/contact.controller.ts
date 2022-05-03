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
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { ContactService } from './contact.service';
import { AddHistoryDto } from './dto/add-history.dto';
import { AddTagDto } from './dto/add-tag.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindContactsDto } from './dto/find-contacts.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { History } from './entities/history.entity';
import { TagWithoutParentAndChildren } from '../tag/entities/tag-without-parent-and-children.entity';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';

@Controller('contacts')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly contactHistoryService: ContactHistoryService,
    private readonly contatTagService: ContactTagService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Post()
  create(@Auth() user: any, @Body() createContactDto: CreateContactDto) {
    return this.contactService.create(user.project.id, createContactDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Get()
  findAll(@Auth() user: any, @Query() query: FindContactsDto) {
    return this.contactService.findAll(user.project.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Get('chatId/:ids')
  findAllByChatId(@Auth() user: any, @Param('ids') ids: string) {
    return this.contactService.findAllByChatId(
      user.project.id,
      ids.split(',').map(Number),
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Get(':id')
  findOne(@Auth() user: any, @Param('id') id: string) {
    return this.contactService.findOne(user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Patch(':id')
  update(
    @Auth() user: any,
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
  @UseInterceptors(new TransformInterceptor(Contact))
  @Delete(':id')
  delete(@Auth() user: any, @Param('id') id: string) {
    return this.contactService.delete(user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('count')
  countAll(@Auth() user: any) {
    return this.contactService.countAll(user.project.id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(History))
  @Get(':id/history')
  getHistory(@Auth() user: any, @Param('id') id: string) {
    return this.contactHistoryService.findAll(user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(History))
  @Post(':id/history')
  addHistory(
    @Auth() user: any,
    @Param('id') id: string,
    @Body() addHistoryDto: AddHistoryDto,
  ) {
    return this.contactHistoryService.create(
      user.project.id,
      Number(id),
      addHistoryDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(TagWithoutParentAndChildren))
  @Get(':id/tags')
  getTags(@Auth() user: any, @Param('id') id: string) {
    return this.contatTagService.findAll(user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(TagWithoutParentAndChildren))
  @Post(':id/tags')
  addTag(
    @Auth() user: any,
    @Param('id') id: string,
    @Body() addTagDto: AddTagDto,
  ) {
    return this.contatTagService.create(user.project.id, Number(id), addTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(TagWithoutParentAndChildren))
  @Delete(':id/tags/:tagId')
  delTag(
    @Auth() user: any,
    @Param('id') id: string,
    @Param('tagId') tagId: string,
  ) {
    return this.contatTagService.delete(
      user.project.id,
      Number(id),
      Number(tagId),
    );
  }
}
