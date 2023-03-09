import { Test, TestingModule } from '@nestjs/testing';
import { PlayaroundController } from './playaround.controller';

describe('PlayaroundController', () => {
  let controller: PlayaroundController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayaroundController],
    }).compile();

    controller = module.get<PlayaroundController>(PlayaroundController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
