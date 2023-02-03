import { Controller, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlainToClassInterceptor } from 'src/shared/interceptors/plain-to-class.interceptor';
import { TagWithoutParentAndChildren } from 'src/tag/entities/tag-without-parent-and-children.entity';
import { ContactAssignedToService } from './contact-assigned-to.service';
import { ContactChatService } from './contact-chat.service';
import { ContactHistoryService } from './contact-history.service';
import { ContactMailingService } from './contact-mailing.service';
import { ContactTagService } from './contact-tag.service';
import { ContactService } from './contact.service';
import { CountAllContactsAssignedToDto } from './dto/count-all-contacts-assigned-to.dto';
import { CreateContactHistoryDto } from './dto/create-contact-history.dto';
import { CreateContactTagDto } from './dto/create-contact-tag.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { FindAllContactsAssignedToDto } from './dto/find-all-contacts-assigned-to.dto';
import { FindAllContactsForMailing } from './dto/find-all-contacts-for-mailing.dto';
import { FindAllContactsDto } from './dto/find-all-contacts.dto';
import { ImportContactsDto } from './dto/import-contacts.dto';
import { RemoveContactTagDto } from './dto/remove-contact-tag.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { CountAllContactsAssignedTo } from './entities/count-all-contacts-assigned-to.entity';
import { History } from './entities/history.entity';

@Controller()
export class ContactController {
  constructor(
    private readonly contactAssignedToService: ContactAssignedToService,
    private readonly contactChatService: ContactChatService,
    private readonly contactHistoryService: ContactHistoryService,
    private readonly contactMailingService: ContactMailingService,
    private readonly contactTagService: ContactTagService,
    private readonly contactService: ContactService,
  ) {}

  @MessagePattern('importContacts')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  import(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() importContacsDto: ImportContactsDto,
  ): Promise<boolean> {
    return this.contactService.import(projectId, importContacsDto);
  }

  @MessagePattern('createContact')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  create(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() createContactDto: CreateContactDto,
  ): Promise<Contact> {
    return this.contactService.create(projectId, createContactDto);
  }

  @MessagePattern('findAllContacts')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  findAll(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() findAllContactsDto: FindAllContactsDto,
  ): Promise<Contact[]> {
    return this.contactService.findAll(projectId, findAllContactsDto);
  }

  @MessagePattern('findOneContact')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  findOne(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<Contact> {
    return this.contactService.findOne(projectId, id);
  }

  @MessagePattern('updateContact')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  update(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return this.contactService.update(projectId, updateContactDto);
  }

  @MessagePattern('removeContact')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  remove(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<Contact> {
    return this.contactService.remove(projectId, id);
  }

  @MessagePattern('findAllContactsAssignedTo')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  findAllAssignedTo(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() findAllContactsAssignedToDto: FindAllContactsAssignedToDto,
  ): Promise<Contact[]> {
    return this.contactAssignedToService.findAll(
      projectId,
      findAllContactsAssignedToDto,
    );
  }

  @MessagePattern('countAllContactsAssignedTo')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  countAllAssignedTo(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() countAllContactsAssignedToDto: CountAllContactsAssignedToDto,
  ): Promise<CountAllContactsAssignedTo> {
    return this.contactAssignedToService.countAll(
      projectId,
      countAllContactsAssignedToDto,
    );
  }

  @MessagePattern('createContactForChat')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  createForChat(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('channelId', ParseIntPipe) channelId: number,
    @Payload('accountId') accountId: string,
    @Payload() createContactDto: CreateContactDto,
  ): Promise<Contact> {
    return this.contactChatService.createForChat(
      projectId,
      channelId,
      accountId,
      createContactDto,
    );
  }

  @MessagePattern('createChatForContact')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  createChatFor(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('contactId', ParseIntPipe) contactId: number,
    @Payload('channelId', ParseIntPipe) channelId: number,
    @Payload('accountId') accountId: string,
  ): Promise<Contact> {
    return this.contactChatService.createChatFor(
      projectId,
      contactId,
      channelId,
      accountId,
    );
  }

  @MessagePattern('findOneContactWithChat')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  findOneContactWithChat(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('channelId', ParseIntPipe) channelId: number,
    @Payload('accountId') accountId: string,
  ): Promise<Contact> {
    return this.contactChatService.findOne(projectId, channelId, accountId);
  }

  @MessagePattern('createContactHistory')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  createHistory(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() createContactHistoryDto: CreateContactHistoryDto,
  ): Promise<History> {
    return this.contactHistoryService.create(
      projectId,
      createContactHistoryDto,
    );
  }

  @MessagePattern('findAllContactHistory')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  findAllHistory(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('contactId', ParseIntPipe) contactId: number,
  ): Promise<History[]> {
    return this.contactHistoryService.findAll(projectId, contactId);
  }

  @MessagePattern('findAllContactsForMailing')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  findAllForMailing(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() findAllContactsForMailingDto: FindAllContactsForMailing,
  ): Promise<any[]> {
    return this.contactMailingService.findAll(
      projectId,
      findAllContactsForMailingDto,
    );
  }

  @MessagePattern('createContactTag')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  createContactTag(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() createContactTagDto: CreateContactTagDto,
  ): Promise<TagWithoutParentAndChildren> {
    return this.contactTagService.create(projectId, createContactTagDto);
  }

  @MessagePattern('findAllContactTags')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  findAllContactTags(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('contactId', ParseIntPipe) contactId: number,
  ): Promise<TagWithoutParentAndChildren[]> {
    return this.contactTagService.findAll(projectId, contactId);
  }

  @MessagePattern('removeContactTag')
  @UseInterceptors(new PlainToClassInterceptor(Contact))
  removeContactTag(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() removeContactTagDto: RemoveContactTagDto,
  ): Promise<TagWithoutParentAndChildren> {
    return this.contactTagService.remove(projectId, removeContactTagDto);
  }
}
