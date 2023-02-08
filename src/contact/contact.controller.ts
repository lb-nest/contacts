import { Controller, ParseIntPipe, SerializeOptions } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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
  import(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() importContacsDto: ImportContactsDto,
  ): Promise<boolean> {
    return this.contactService.import(projectId, importContacsDto);
  }

  @SerializeOptions({
    type: Contact,
  })
  @MessagePattern('createContact')
  create(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() createContactDto: CreateContactDto,
  ): Promise<Contact> {
    return this.contactService.create(projectId, createContactDto);
  }

  @SerializeOptions({
    type: Contact,
  })
  @MessagePattern('findAllContacts')
  findAll(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() findAllContactsDto: FindAllContactsDto,
  ): Promise<Contact[]> {
    return this.contactService.findAll(projectId, findAllContactsDto);
  }

  @SerializeOptions({
    type: Contact,
  })
  @MessagePattern('findOneContact')
  findOne(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<Contact> {
    return this.contactService.findOne(projectId, id);
  }

  @SerializeOptions({
    type: Contact,
  })
  @MessagePattern('updateContact')
  update(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return this.contactService.update(projectId, updateContactDto);
  }

  @SerializeOptions({
    type: Contact,
  })
  @MessagePattern('removeContact')
  remove(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<Contact> {
    return this.contactService.remove(projectId, id);
  }

  @SerializeOptions({
    type: Contact,
  })
  @MessagePattern('findAllContactsAssignedTo')
  findAllAssignedTo(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() findAllContactsAssignedToDto: FindAllContactsAssignedToDto,
  ): Promise<Contact[]> {
    return this.contactAssignedToService.findAll(
      projectId,
      findAllContactsAssignedToDto,
    );
  }

  @SerializeOptions({
    type: CountAllContactsAssignedTo,
  })
  @MessagePattern('countAllContactsAssignedTo')
  countAllAssignedTo(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() countAllContactsAssignedToDto: CountAllContactsAssignedToDto,
  ): Promise<CountAllContactsAssignedTo> {
    return this.contactAssignedToService.countAll(
      projectId,
      countAllContactsAssignedToDto,
    );
  }

  @SerializeOptions({
    type: CountAllContactsAssignedTo,
  })
  @MessagePattern('createContactForChat')
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

  @SerializeOptions({
    type: CountAllContactsAssignedTo,
  })
  @MessagePattern('createChatForContact')
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

  @SerializeOptions({
    type: CountAllContactsAssignedTo,
  })
  @MessagePattern('findOneContactWithChat')
  findOneContactWithChat(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('channelId', ParseIntPipe) channelId: number,
    @Payload('accountId') accountId: string,
  ): Promise<Contact> {
    return this.contactChatService.findOne(projectId, channelId, accountId);
  }

  @SerializeOptions({
    type: History,
  })
  @MessagePattern('createContactHistory')
  createHistory(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() createContactHistoryDto: CreateContactHistoryDto,
  ): Promise<History> {
    return this.contactHistoryService.create(
      projectId,
      createContactHistoryDto,
    );
  }

  @SerializeOptions({
    type: History,
  })
  @MessagePattern('findAllContactHistory')
  findAllHistory(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('contactId', ParseIntPipe) contactId: number,
  ): Promise<History[]> {
    return this.contactHistoryService.findAll(projectId, contactId);
  }

  @SerializeOptions({
    // type: Contact,
  })
  @MessagePattern('findAllContactsForMailing')
  findAllForMailing(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() findAllContactsForMailingDto: FindAllContactsForMailing,
  ): Promise<any[]> {
    return this.contactMailingService.findAll(
      projectId,
      findAllContactsForMailingDto,
    );
  }

  @SerializeOptions({
    type: TagWithoutParentAndChildren,
  })
  @MessagePattern('createContactTag')
  createContactTag(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() createContactTagDto: CreateContactTagDto,
  ): Promise<TagWithoutParentAndChildren> {
    return this.contactTagService.create(projectId, createContactTagDto);
  }

  @SerializeOptions({
    type: TagWithoutParentAndChildren,
  })
  @MessagePattern('findAllContactTags')
  findAllContactTags(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload('contactId', ParseIntPipe) contactId: number,
  ): Promise<TagWithoutParentAndChildren[]> {
    return this.contactTagService.findAll(projectId, contactId);
  }

  @SerializeOptions({
    type: TagWithoutParentAndChildren,
  })
  @MessagePattern('removeContactTag')
  removeContactTag(
    @Payload('projectId', ParseIntPipe) projectId: number,
    @Payload() removeContactTagDto: RemoveContactTagDto,
  ): Promise<TagWithoutParentAndChildren> {
    return this.contactTagService.remove(projectId, removeContactTagDto);
  }
}
