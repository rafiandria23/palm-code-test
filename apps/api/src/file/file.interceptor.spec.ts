import _ from 'lodash';
import { Reflector } from '@nestjs/core';
import {
  ExecutionContext,
  CallHandler,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import path from 'node:path';
import { of } from 'rxjs';
import { faker } from '@faker-js/faker';

import { FileService } from './file.service';
import { FileInterceptor } from './file.interceptor';

describe('FileInterceptor', () => {
  let interceptor: FileInterceptor;

  const reflectorMock = {
    getAllAndOverride: jest.fn(),
  };

  const fileServiceMock = {
    upload: jest.fn(),
  };

  const executionContextMock = {
    switchToHttp: jest.fn(),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  };

  const lodashMock = {
    set: jest.spyOn(_, 'set'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileInterceptor,
        {
          provide: Reflector,
          useValue: reflectorMock,
        },
        {
          provide: FileService,
          useValue: fileServiceMock,
        },
      ],
    }).compile();

    interceptor = module.get<FileInterceptor>(FileInterceptor);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should return 400 when request is not multipart', async () => {
    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(false),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });

    let err: BadRequestException;

    try {
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(2);

    expect(err).toBeInstanceOf(BadRequestException);
    expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return 500 when file config is not provided', async () => {
    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    executionContextMock.getHandler.mockReturnValue(jest.fn());
    executionContextMock.getClass.mockReturnValue({});
    reflectorMock.getAllAndOverride.mockReturnValue(null);

    let err: InternalServerErrorException;

    try {
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(2);
    expect(executionContextMock.getHandler).toHaveBeenCalledTimes(1);
    expect(executionContextMock.getClass).toHaveBeenCalledTimes(1);
    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(InternalServerErrorException);
    expect(err.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should return 400 when file is empty', async () => {
    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue(null),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    executionContextMock.getHandler.mockReturnValue(jest.fn());
    executionContextMock.getClass.mockReturnValue({});
    reflectorMock.getAllAndOverride.mockReturnValue({ field: 'file' });

    let err: BadRequestException;

    try {
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(2);
    expect(executionContextMock.getHandler).toHaveBeenCalledTimes(1);
    expect(executionContextMock.getClass).toHaveBeenCalledTimes(1);
    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(BadRequestException);
    expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return 400 when file field name is invalid', async () => {
    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({ fieldname: faker.string.alpha() }),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    executionContextMock.getHandler.mockReturnValue(jest.fn());
    executionContextMock.getClass.mockReturnValue({});
    reflectorMock.getAllAndOverride.mockReturnValue({
      field: faker.string.alpha(),
    });

    let err: BadRequestException;

    try {
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(2);
    expect(executionContextMock.getHandler).toHaveBeenCalledTimes(1);
    expect(executionContextMock.getClass).toHaveBeenCalledTimes(1);
    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(BadRequestException);
    expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return 400 when file extension is invalid', async () => {
    const fileFieldNameMock = faker.string.alpha({
      casing: 'lower',
    });

    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({
          fieldname: fileFieldNameMock,
          filename: faker.system.fileName(),
          mimetype: faker.system.mimeType(),
        }),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    executionContextMock.getHandler.mockReturnValue(jest.fn());
    executionContextMock.getClass.mockReturnValue({});
    reflectorMock.getAllAndOverride.mockReturnValue({
      field: fileFieldNameMock,
      type: [{ mimeType: faker.system.mimeType(), extensions: [] }],
    });

    let err: BadRequestException;

    try {
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(2);
    expect(executionContextMock.getHandler).toHaveBeenCalledTimes(1);
    expect(executionContextMock.getClass).toHaveBeenCalledTimes(1);
    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(BadRequestException);
    expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return 400 when file size limit is exceeded', async () => {
    const fileFieldNameMock = faker.string.alpha({
      casing: 'lower',
    });
    const filenameMock = faker.system.fileName();
    const fileMimeTypeMock = faker.system.mimeType();

    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({
          fieldname: fileFieldNameMock,
          filename: filenameMock,
          mimetype: fileMimeTypeMock,
        }),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    executionContextMock.getHandler.mockReturnValue(jest.fn());
    executionContextMock.getClass.mockReturnValue({});
    reflectorMock.getAllAndOverride.mockReturnValue({
      field: fileFieldNameMock,
      type: [
        {
          mimeType: fileMimeTypeMock,
          extensions: [path.extname(filenameMock)],
        },
      ],
      size: 1,
    });

    const fileAbortError = new Error();
    fileAbortError.name = 'AbortError';

    fileServiceMock.upload.mockReturnValue({
      on: jest.fn().mockImplementation((__, cb) => cb({ loaded: 2 })),
      abort: jest.fn().mockResolvedValue(undefined),
      done: jest.fn().mockRejectedValue(fileAbortError),
    });

    let err: BadRequestException;

    try {
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(2);
    expect(executionContextMock.getHandler).toHaveBeenCalledTimes(1);
    expect(executionContextMock.getClass).toHaveBeenCalledTimes(1);
    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(fileServiceMock.upload).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(BadRequestException);
    expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should throw error when file size limit is exceeded', async () => {
    const fileFieldNameMock = faker.string.alpha({
      casing: 'lower',
    });
    const filenameMock = faker.system.fileName();
    const fileMimeTypeMock = faker.system.mimeType();

    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({
          fieldname: fileFieldNameMock,
          filename: filenameMock,
          mimetype: fileMimeTypeMock,
        }),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    executionContextMock.getHandler.mockReturnValue(jest.fn());
    executionContextMock.getClass.mockReturnValue({});
    reflectorMock.getAllAndOverride.mockReturnValue({
      field: fileFieldNameMock,
      type: [
        {
          mimeType: fileMimeTypeMock,
          extensions: [path.extname(filenameMock)],
        },
      ],
      size: faker.number.int(),
    });
    fileServiceMock.upload.mockReturnValue({
      on: jest.fn().mockReturnValue(undefined),
      abort: jest.fn().mockResolvedValue(undefined),
      done: jest.fn().mockRejectedValue(new Error()),
    });

    let err: Error;

    try {
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(2);
    expect(executionContextMock.getHandler).toHaveBeenCalledTimes(1);
    expect(executionContextMock.getClass).toHaveBeenCalledTimes(1);
    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(fileServiceMock.upload).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(Error);
  });

  it('should attach file key into response', async () => {
    const fileFieldNameMock = faker.string.alpha({
      casing: 'lower',
    });
    const filenameMock = faker.system.fileName();
    const fileMimeTypeMock = faker.system.mimeType();
    const fileSizeMock = faker.number.int();

    const responseMock = {};

    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({
          fieldname: fileFieldNameMock,
          filename: filenameMock,
          mimetype: fileMimeTypeMock,
        }),
      }),
      getResponse: jest.fn().mockReturnValue(responseMock),
    });
    executionContextMock.getHandler.mockReturnValue(jest.fn());
    executionContextMock.getClass.mockReturnValue({});
    reflectorMock.getAllAndOverride.mockReturnValue({
      field: fileFieldNameMock,
      type: [
        {
          mimeType: fileMimeTypeMock,
          extensions: [path.extname(filenameMock)],
        },
      ],
      size: fileSizeMock,
    });

    const expectedFileKey = faker.string.alphanumeric();

    fileServiceMock.upload.mockReturnValue({
      on: jest
        .fn()
        .mockImplementation((__, cb) => cb({ loaded: fileSizeMock })),
      abort: jest.fn().mockResolvedValue(undefined),
      done: jest.fn().mockResolvedValue({
        Key: expectedFileKey,
      }),
    });

    const callHandlerMock = {
      handle: () => of(),
    };

    await interceptor.intercept(
      executionContextMock as unknown as ExecutionContext,
      callHandlerMock as CallHandler,
    );

    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(2);
    expect(executionContextMock.getHandler).toHaveBeenCalledTimes(1);
    expect(executionContextMock.getClass).toHaveBeenCalledTimes(1);
    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(fileServiceMock.upload).toHaveBeenCalledTimes(1);

    expect(lodashMock.set).toHaveBeenCalledWith(
      responseMock,
      'file.key',
      expectedFileKey,
    );
  });
});
