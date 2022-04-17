import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AppService {
  constructor(private readonly eventEmiter: EventEmitter2) {}

  async handleEvents(projectId: number, event: any) {
    this.eventEmiter.emit('newContactFromMessagingService', projectId, {
      chatId: event.payload,
      ...event.payload.contact,
    });
  }
}
