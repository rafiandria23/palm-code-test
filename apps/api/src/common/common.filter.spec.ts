import { HttpAdapterHost } from '@nestjs/core';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { CommonService } from './common.service';
import { ExceptionFilter } from './common.filter';

describe('Common filters', () => {
  describe('ExceptionFilter', () => {
    let commonService: CommonService;

    let filter: ExceptionFilter;

    const httpAdapterHostMock = {
      httpAdapter: {
        reply: jest.fn(),
      },
    };

    const argumentsHostMock = {
      switchToHttp: jest.fn(),
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ExceptionFilter,
          {
            provide: HttpAdapterHost,
            useValue: httpAdapterHostMock,
          },
          CommonService,
        ],
      }).compile();

      commonService = module.get<CommonService>(CommonService);

      filter = module.get<ExceptionFilter>(ExceptionFilter);
    });

    afterEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    it('should return 500 and log error when error is not HttpException instance', () => {
      argumentsHostMock.switchToHttp.mockReturnValue({
        getResponse: jest.fn(),
      });

      filter.catch(
        new Error(faker.string.alpha()),
        argumentsHostMock as unknown as ArgumentsHost,
      );
    });

    it('should return proper HTTP status and error message when error data is not object', () => {
      const expectedResponseData = commonService.successTimestamp({
        success: false,
        data: {
          message: faker.string.alpha(),
        },
      });

      argumentsHostMock.switchToHttp.mockReturnValue({
        getResponse: jest.fn(),
      });

      filter.catch(
        new HttpException(
          expectedResponseData.data,
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        argumentsHostMock as unknown as ArgumentsHost,
      );
    });

    it('should return proper HTTP status and error message when error data is object', () => {
      const expectedResponseData = commonService.successTimestamp({
        success: false,
        data: [
          {
            [faker.string.alpha()]: faker.string.alpha(),
          },
        ],
      });

      argumentsHostMock.switchToHttp.mockReturnValue({
        getResponse: jest.fn(),
      });

      filter.catch(
        new HttpException(
          expectedResponseData.data,
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        argumentsHostMock as unknown as ArgumentsHost,
      );
    });
  });
});
