import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsnestController } from './departmentsnest.controller';

describe('DepartmentsnestController', () => {
  let controller: DepartmentsnestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsnestController],
    }).compile();

    controller = module.get<DepartmentsnestController>(
      DepartmentsnestController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
