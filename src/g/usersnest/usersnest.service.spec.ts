import { Test, TestingModule } from '@nestjs/testing';
import { UsersnestService } from './usersnest.service';

describe('UsersnestService', () => {
  let service: UsersnestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersnestService],
    }).compile();

    service = module.get<UsersnestService>(UsersnestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
