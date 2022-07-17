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
import { BearerAuthGuard } from 'src/auth/bearer-auth.guard';
import { User } from 'src/auth/user.decorator';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { TagWithoutParentAndChildren } from '../tag/entities/tag-without-parent-and-children.entity';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';
import { ContactService } from './contact.service';
import { CreateContactTagDto } from './dto/create-contact-tag.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { CreateHistoryDto } from './dto/create-history.dto';
import { FindAllContactsDto } from './dto/find-all-contacts.dto';
import { ImportContactsDto } from './dto/import-contacts.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { History } from './entities/history.entity';

@Controller('contacts')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly contactHistoryService: ContactHistoryService,
    private readonly contatTagService: ContactTagService,
  ) {}

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Post()
  create(@User() user: any, @Body() createContactDto: CreateContactDto) {
    return this.contactService.create(user.project.id, createContactDto);
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Get()
  findAll(@User() user: any, @Query() query: FindAllContactsDto) {
    return this.contactService.findAll(user.project.id, query);
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Get('findAllByChatId')
  findAllByChatId(@User() user: any, @Query('chatId') ids: string) {
    return this.contactService.findAllByChatId(
      user.project.id,
      ids?.split(',').map(Number).filter(Boolean),
    );
  }

  @UseGuards(BearerAuthGuard)
  @Get('countAll')
  countAll(@User() user: any) {
    return this.contactService.countAll(user.project.id, user.id);
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Get(':id')
  findOne(@User() user: any, @Param('id') id: string) {
    return this.contactService.findOne(user.project.id, Number(id));
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
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

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Delete(':id')
  delete(@User() user: any, @Param('id') id: string) {
    return this.contactService.delete(user.project.id, Number(id));
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Post('import')
  import(
    @User() user: any,
    @Body() importContacsDto: ImportContactsDto,
  ): Promise<Contact[]> {
    return this.contactService.import(user.project.id, importContacsDto);
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(History))
  @Post(':contactId/history')
  createHistory(
    @User() user: any,
    @Param('contactId') contactId: string,
    @Body() createHistoryDto: CreateHistoryDto,
  ) {
    return this.contactHistoryService.create(
      user.project.id,
      Number(contactId),
      createHistoryDto,
    );
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(History))
  @Get(':contactId/history')
  findAllHistory(@User() user: any, @Param('contactId') contactId: string) {
    return this.contactHistoryService.findAll(
      user.project.id,
      Number(contactId),
    );
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(TagWithoutParentAndChildren))
  @Post(':contactId/tags')
  createContactTag(
    @User() user: any,
    @Param('contactId') contactId: string,
    @Body() createContactTagDto: CreateContactTagDto,
  ) {
    return this.contatTagService.create(
      user.project.id,
      Number(contactId),
      createContactTagDto,
    );
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(TagWithoutParentAndChildren))
  @Get(':contactId/tags')
  findAllContactTags(@User() user: any, @Param('contactId') id: string) {
    return this.contatTagService.findAll(user.project.id, Number(id));
  }

  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new TransformInterceptor(TagWithoutParentAndChildren))
  @Delete(':contactId/tags/:tagId')
  deleteContactTag(
    @User() user: any,
    @Param('contactId') contactId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.contatTagService.delete(
      user.project.id,
      Number(contactId),
      Number(tagId),
    );
  }
}
