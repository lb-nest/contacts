import { Test, TestingModule } from '@nestjs/testing';
import { ContactChatService } from './contact-chat.service';
import { ContactTagService } from './contact-tag.service';

describe('ContactChatService', () => {
  let service: ContactChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactTagService],
    }).compile();

    service = module.get<ContactChatService>(ContactChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
