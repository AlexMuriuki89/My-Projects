import { Test, TestingModule } from '@nestjs/testing';
import { TasksnbnestController } from './tasksnbnest.controller';

describe('TasksnbnestController', () => {
  let controller: TasksnbnestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksnbnestController],
    }).compile();

    controller = module.get<TasksnbnestController>(TasksnbnestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
