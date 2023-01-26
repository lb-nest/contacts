import { Test, TestingModule } from '@nestjs/testing';
import { ContactAssignedToService } from './contact-assigned-to.service';

describe('ContactAssignedToService', () => {
  let service: ContactAssignedToService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactAssignedToService],
    }).compile();

    service = module.get<ContactAssignedToService>(ContactAssignedToService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
