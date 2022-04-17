import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ContactService } from './contact.service';
import { AddTagDto } from './dto/add-tag.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() createContactDto: CreateContactDto) {
    return this.contactService.create(req.user.project.id, createContactDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.contactService.findAll(req.user.project.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.contactService.findOne(req.user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactService.update(
      req.user.project.id,
      Number(id),
      updateContactDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.contactService.delete(req.user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/tags')
  getTags(@Req() req: any, @Param('id') id: string) {
    return this.contactService.getTags(req.user.project.id, Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/tags')
  addTag(
    @Req() req: any,
    @Param('id') id: string,
    @Body() addTagDto: AddTagDto,
  ) {
    return this.contactService.addTag(
      req.user.project.id,
      Number(id),
      addTagDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/tags/:tagId')
  addDelete(
    @Req() req: any,
    @Param('id') id: string,
    @Param('tagId') tagId: string,
  ) {
    return this.contactService.deleteTag(
      req.user.project.id,
      Number(id),
      Number(tagId),
    );
  }
}
