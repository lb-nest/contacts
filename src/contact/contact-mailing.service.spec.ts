import { Test, TestingModule } from '@nestjs/testing';
import { ContactMailingService } from './contact-mailing.service';

describe('ContactMailingService', () => {
  let service: ContactMailingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactMailingService],
    }).compile();

    service = module.get<ContactMailingService>(ContactMailingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
