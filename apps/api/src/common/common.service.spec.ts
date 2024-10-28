import { Test, TestingModule } from '@nestjs/testing';

import { CommonService } from './common.service';

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonService],
    }).compile();

    service = module.get<CommonService>(CommonService);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe('successTimestamp', () => {
    it('should return success timestamp', () => {
      const result = service.successTimestamp();

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
    });
  });
});
