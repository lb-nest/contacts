import { Test, TestingModule } from '@nestjs/testing';
import { ContactTagService } from './contact-tag.service';

describe('ContactTagService', () => {
  let service: ContactTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactTagService],
    }).compile();

    service = module.get<ContactTagService>(ContactTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
