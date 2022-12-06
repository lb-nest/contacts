import {
  Body,
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
import { TagWithoutParentAndChildren } from '../tag/entities/tag-without-parent-and-children.entity';
import { ContactTagService } from './contact-tag.service';
import { ContactService } from './contact.service';
import { CreateChatForContactDto } from './dto/create-chat-for-contact.dto';
import { CreateContactForChatDto } from './dto/create-contact-for-chat.dto';
import { CreateContactTagDto } from './dto/create-contact-tag.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { CreateHistoryDto } from './dto/create-history.dto';
import { FindAllContactsForUserDto } from './dto/find-all-contacts-for-user.dto';
import { FindAllContactsDto } from './dto/find-all-contacts.dto';
import { FindOneContactForChatDto } from './dto/find-one-contact-for-chat.dto';
import { ImportContactsDto } from './dto/import-contacts.dto';
import { RemoveContactTagDto } from './dto/remove-contact-tag.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { CountAllContacts } from './entities/count-all-contacts.entity';
import { History } from './entities/history.entity';
import { HistoryService } from './history.service';

@Controller()
export class ContactController {
  constructor(
    private readonly contactTagService: ContactTagService,
    private readonly contactService: ContactService,
    private readonly historyService: HistoryService,
  ) {}

  @MessagePattern('contacts.import')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  import(
    @Auth() auth: TokenPayload,
    @Body('payload') importContacsDto: ImportContactsDto,
  ): Promise<boolean> {
    return this.contactService.import(auth.project.id, importContacsDto);
  }

  @MessagePattern('contacts.create')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  create(
    @Auth() auth: TokenPayload,
    @Payload('payload') createContactDto: CreateContactDto,
  ): Promise<Contact> {
    return this.contactService.create(auth.project.id, createContactDto);
  }

  @MessagePattern('contacts.createForChat')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  createForChat(
    @Auth() auth: TokenPayload,
    @Payload('payload') createContactForChatDto: CreateContactForChatDto,
  ): Promise<Contact> {
    return this.contactService.createForChat(
      auth.project.id,
      createContactForChatDto,
    );
  }

  @MessagePattern('contacts.createChatFor')
  @UseGuards(BearerAuthGuard)
  createChat(
    @Auth() auth: TokenPayload,
    @Payload('payload') createChatForContactDto: CreateChatForContactDto,
  ): Promise<boolean> {
    return this.contactService.createChatFor(
      auth.project.id,
      createChatForContactDto,
    );
  }

  @MessagePattern('contacts.findAll')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  findAll(
    @Auth() auth: TokenPayload,
    @Payload('payload') findAllContactsDto: FindAllContactsDto,
  ): Promise<Contact[]> {
    return this.contactService.findAll(auth.project.id, findAllContactsDto);
  }

  @MessagePattern('contacts.findAllForUser')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  findAllForUser(
    @Auth() auth: TokenPayload,
    @Payload('payload') findAllContactForUserDto: FindAllContactsForUserDto,
  ): Promise<Contact[]> {
    return this.contactService.findAllForUser(
      auth.project.id,
      auth.id,
      findAllContactForUserDto,
    );
  }

  @MessagePattern('contacts.findOneForChat')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  findAllForChat(
    @Auth() auth: TokenPayload,
    @Payload('payload') findOneContactForChatDto: FindOneContactForChatDto,
  ): Promise<Contact[]> {
    return this.contactService.findOneForChat(
      auth.project.id,
      findOneContactForChatDto,
    );
  }

  @MessagePattern('contacts.findOne')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  findOne(
    @Auth() auth: TokenPayload,
    @Payload('payload', ParseIntPipe) id: number,
  ): Promise<Contact> {
    return this.contactService.findOne(auth.project.id, id);
  }

  @MessagePattern('contacts.update')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  update(
    @Auth() auth: TokenPayload,
    @Payload('payload') updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return this.contactService.update(auth.project.id, updateContactDto);
  }

  @MessagePattern('contacts.remove')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  remove(
    @Auth() auth: TokenPayload,
    @Payload('payload', ParseIntPipe) id: number,
  ): Promise<Contact> {
    return this.contactService.remove(auth.project.id, Number(id));
  }

  @MessagePattern('contacts.createHistory')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(History))
  createHistory(
    @Auth() auth: TokenPayload,
    @Payload('payload') createHistoryDto: CreateHistoryDto,
  ): Promise<History> {
    return this.historyService.create(auth.project.id, createHistoryDto);
  }

  @MessagePattern('contacts.findAllHistory')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(History))
  findAllHistory(
    @Auth() auth: TokenPayload,
    @Payload('payload', ParseIntPipe) contactId: number,
  ): Promise<History[]> {
    return this.historyService.findAll(auth.project.id, contactId);
  }

  @MessagePattern('contacts.createContactTag')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(TagWithoutParentAndChildren))
  createContactTag(
    @Auth() auth: TokenPayload,
    @Payload('payload') createContactTagDto: CreateContactTagDto,
  ): Promise<TagWithoutParentAndChildren> {
    return this.contactTagService.create(auth.project.id, createContactTagDto);
  }

  @MessagePattern('contacts.findAllContactTags')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(TagWithoutParentAndChildren))
  findAllContactTags(
    @Auth() auth: TokenPayload,
    @Payload('payload', ParseIntPipe) contactId: number,
  ): Promise<TagWithoutParentAndChildren[]> {
    return this.contactTagService.findAll(auth.project.id, contactId);
  }

  @MessagePattern('contacts.removeContactTag')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(TagWithoutParentAndChildren))
  removeContactTag(
    @Auth() auth: TokenPayload,
    @Payload('payload') removeContactTagDto: RemoveContactTagDto,
  ): Promise<TagWithoutParentAndChildren> {
    return this.contactTagService.remove(auth.project.id, removeContactTagDto);
  }

  @MessagePattern('contacts.countAll')
  @UseGuards(BearerAuthGuard)
  @UseInterceptors(new PlainToClassInterceptor(CountAllContacts))
  countAll(@Auth() auth: TokenPayload): Promise<CountAllContacts> {
    return this.contactService.countAllForUser(auth.project.id, auth.id);
  }
}
