import { HttpAdapterHost } from '@nestjs/core';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { CommonService } from './common.service';
import { ExceptionFilter } from './common.filter';

describe('Common filters', () => {
  describe('ExceptionFilter', () => {
    let commonService: CommonService;
    let service: ExceptionFilter;

    const mockedHttpAdapterHost = {
      httpAdapter: jest.fn(),
    };

    const mockedArgumentsHost = {
      switchToHttp: jest.fn(),
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CommonService,
          {
            provide: ExceptionFilter,
            useFactory: (commonService: CommonService) => {
              return new ExceptionFilter(
                mockedHttpAdapterHost as unknown as HttpAdapterHost<FastifyAdapter>,
                commonService,
              );
            },
          },
        ],
      }).compile();

      commonService = module.get<CommonService>(CommonService);
      service = module.get<ExceptionFilter>(ExceptionFilter);
    });

    afterEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    it('should return 500 and log error when error is not HttpException instance', () => {
      mockedArgumentsHost.switchToHttp.mockReturnValue({
        getResponse: jest.fn(),
      });

      service.catch(
        new Error(faker.string.alpha()),
        mockedArgumentsHost as unknown as ArgumentsHost,
      );
    });

    it('should return proper HTTP status and error message when error data is not object', () => {
      const expectedHttpStatus = faker.helpers.arrayElement(
        Object.values(HttpStatus),
      );
      const expectedResponseData = commonService.successTimestamp({
        success: false,
        data: {
          message: faker.string.alpha(),
        },
      });

      mockedArgumentsHost.switchToHttp.mockReturnValue({
        getResponse: jest.fn(),
      });

      service.catch(
        new HttpException(
          expectedResponseData.data,
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        mockedArgumentsHost as unknown as ArgumentsHost,
      );
    });

    it('should return proper HTTP status and error message when error data is object', () => {
      const expectedHttpStatus = faker.helpers.arrayElement(
        Object.values(HttpStatus),
      );
      const expectedResponseData = commonService.successTimestamp({
        success: false,
        data: [
          {
            [faker.string.alpha()]: faker.string.alpha(),
          },
        ],
      });

      mockedArgumentsHost.switchToHttp.mockReturnValue({
        getResponse: jest.fn(),
      });

      service.catch(
        new HttpException(
          expectedResponseData.data,
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        mockedArgumentsHost as unknown as ArgumentsHost,
      );
    });
  });
});
