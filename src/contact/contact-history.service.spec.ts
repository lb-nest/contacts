import { Test, TestingModule } from '@nestjs/testing';
import { ContactHistoryService } from './contact-history.service';

describe('ContactHistoryService', () => {
  let service: ContactHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactHistoryService],
    }).compile();

    service = module.get<ContactHistoryService>(ContactHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
