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
import { TagWithoutParentAndChildren } from '../tag/entities/tag-without-parent-and-children.entity';
import { ContactHistoryService } from './contact-history.service';
import { ContactTagService } from './contact-tag.service';
import { ContactService } from './contact.service';
import { CreateContactTagDto } from './dto/create-contact-tag.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { CreateHistoryDto } from './dto/create-history.dto';
import { FindAllContactsDto } from './dto/find-all-contacts.dto';
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

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Post()
  create(@Auth() user: any, @Body() createContactDto: CreateContactDto) {
    return this.contactService.create(user.project.id, createContactDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Get()
  findAll(@Auth() user: any, @Query() query: FindAllContactsDto) {
    return this.contactService.findAll(user.project.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(Contact))
  @Get('filter')
  findAllByChatIds(@Auth() user: any, @Query('chatIds') ids: string) {
    return this.contactService.findAllByChatIds(
      user.project.id,
      ids?.split(',').map(Number).filter(Boolean),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('count')
  countAll(@Auth() user: any) {
    return this.contactService.countAll(user.project.id, user.id);
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
  @UseInterceptors(new TransformInterceptor(History))
  @Post(':contactId/history')
  createHistory(
    @Auth() user: any,
    @Param('contactId') contactId: string,
    @Body() createHistoryDto: CreateHistoryDto,
  ) {
    return this.contactHistoryService.create(
      user.project.id,
      Number(contactId),
      createHistoryDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(History))
  @Get(':id/history')
  findAllHistory(@Auth() user: any, @Param('contactId') contactId: string) {
    return this.contactHistoryService.findAll(
      user.project.id,
      Number(contactId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(TagWithoutParentAndChildren))
  @Post(':contactId/tags')
  createContactTag(
    @Auth() user: any,
    @Param('contactId') contactId: string,
    @Body() createContactTagDto: CreateContactTagDto,
  ) {
    return this.contatTagService.create(
      user.project.id,
      Number(contactId),
      createContactTagDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(TagWithoutParentAndChildren))
  @Get(':contactId/tags')
  findAllContactTags(@Auth() user: any, @Param('contactId') id: string) {
    return this.contatTagService.findAll(user.project.contactId, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new TransformInterceptor(TagWithoutParentAndChildren))
  @Delete(':contactId/tags/:tagId')
  deleteContactTag(
    @Auth() user: any,
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
