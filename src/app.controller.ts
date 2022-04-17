import { Body, Controller, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('projects/:id/events')
  handleEvents(@Param('id') id: string, @Body() event: any) {
    this.appService.handleEvents(Number(id), event);
  }
}
