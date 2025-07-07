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
import path from 'path';
import { of } from 'rxjs';
import { faker } from '@faker-js/faker';

import { FileService } from './file.service';
import { FileInterceptor } from './file.interceptor';

describe('FileInterceptor', () => {
  let interceptor: FileInterceptor;

  const mockedReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockedFileService = {
    upload: jest.fn(),
  };

  const mockedExecutionContext = {
    switchToHttp: jest.fn(),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  };

  const mockedLodash = {
    set: jest.spyOn(_, 'set'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileInterceptor,
        {
          provide: Reflector,
          useValue: mockedReflector,
        },
        {
          provide: FileService,
          useValue: mockedFileService,
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
    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(false),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });

    let err: BadRequestException;

    try {
      await interceptor.intercept(
        mockedExecutionContext as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(2);

    expect(err).toBeInstanceOf(BadRequestException);
    expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return 500 when file config is not provided', async () => {
    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    mockedExecutionContext.getHandler.mockReturnValue(jest.fn());
    mockedExecutionContext.getClass.mockReturnValue({});
    mockedReflector.getAllAndOverride.mockReturnValue(null);

    let err: InternalServerErrorException;

    try {
      await interceptor.intercept(
        mockedExecutionContext as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(2);
    expect(mockedExecutionContext.getHandler).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.getClass).toHaveBeenCalledTimes(1);
    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(InternalServerErrorException);
    expect(err.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should return 400 when file is empty', async () => {
    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue(null),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    mockedExecutionContext.getHandler.mockReturnValue(jest.fn());
    mockedExecutionContext.getClass.mockReturnValue({});
    mockedReflector.getAllAndOverride.mockReturnValue({ field: 'file' });

    let err: BadRequestException;

    try {
      await interceptor.intercept(
        mockedExecutionContext as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(2);
    expect(mockedExecutionContext.getHandler).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.getClass).toHaveBeenCalledTimes(1);
    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(BadRequestException);
    expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return 400 when file field name is invalid', async () => {
    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({ fieldname: faker.string.alpha() }),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    mockedExecutionContext.getHandler.mockReturnValue(jest.fn());
    mockedExecutionContext.getClass.mockReturnValue({});
    mockedReflector.getAllAndOverride.mockReturnValue({
      field: faker.string.alpha(),
    });

    let err: BadRequestException;

    try {
      await interceptor.intercept(
        mockedExecutionContext as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(2);
    expect(mockedExecutionContext.getHandler).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.getClass).toHaveBeenCalledTimes(1);
    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(BadRequestException);
    expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return 400 when file extension is invalid', async () => {
    const mockedFileFieldName = faker.string.alpha({
      casing: 'lower',
    });

    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({
          fieldname: mockedFileFieldName,
          filename: faker.system.fileName(),
          mimetype: faker.system.mimeType(),
        }),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    mockedExecutionContext.getHandler.mockReturnValue(jest.fn());
    mockedExecutionContext.getClass.mockReturnValue({});
    mockedReflector.getAllAndOverride.mockReturnValue({
      field: mockedFileFieldName,
      type: [{ mimeType: faker.system.mimeType(), extensions: [] }],
    });

    let err: BadRequestException;

    try {
      await interceptor.intercept(
        mockedExecutionContext as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(2);
    expect(mockedExecutionContext.getHandler).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.getClass).toHaveBeenCalledTimes(1);
    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(BadRequestException);
    expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return 400 when file size limit is exceeded', async () => {
    const mockedFileFieldName = faker.string.alpha({
      casing: 'lower',
    });
    const mockedFilename = faker.system.fileName();
    const mockedFileMimeType = faker.system.mimeType();

    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({
          fieldname: mockedFileFieldName,
          filename: mockedFilename,
          mimetype: mockedFileMimeType,
        }),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    mockedExecutionContext.getHandler.mockReturnValue(jest.fn());
    mockedExecutionContext.getClass.mockReturnValue({});
    mockedReflector.getAllAndOverride.mockReturnValue({
      field: mockedFileFieldName,
      type: [
        {
          mimeType: mockedFileMimeType,
          extensions: [path.extname(mockedFilename)],
        },
      ],
      size: 1,
    });

    const fileAbortError = new Error();
    fileAbortError.name = 'AbortError';

    mockedFileService.upload.mockReturnValue({
      on: jest.fn().mockImplementation((__, cb) => cb({ loaded: 2 })),
      abort: jest.fn().mockResolvedValue(undefined),
      done: jest.fn().mockRejectedValue(fileAbortError),
    });

    let err: BadRequestException;

    try {
      await interceptor.intercept(
        mockedExecutionContext as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(2);
    expect(mockedExecutionContext.getHandler).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.getClass).toHaveBeenCalledTimes(1);
    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(mockedFileService.upload).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(BadRequestException);
    expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should throw error when file size limit is exceeded', async () => {
    const mockedFileFieldName = faker.string.alpha({
      casing: 'lower',
    });
    const mockedFilename = faker.system.fileName();
    const mockedFileMimeType = faker.system.mimeType();

    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({
          fieldname: mockedFileFieldName,
          filename: mockedFilename,
          mimetype: mockedFileMimeType,
        }),
      }),
      getResponse: jest.fn().mockReturnValue({}),
    });
    mockedExecutionContext.getHandler.mockReturnValue(jest.fn());
    mockedExecutionContext.getClass.mockReturnValue({});
    mockedReflector.getAllAndOverride.mockReturnValue({
      field: mockedFileFieldName,
      type: [
        {
          mimeType: mockedFileMimeType,
          extensions: [path.extname(mockedFilename)],
        },
      ],
      size: faker.number.int(),
    });
    mockedFileService.upload.mockReturnValue({
      on: jest.fn().mockReturnValue(undefined),
      abort: jest.fn().mockResolvedValue(undefined),
      done: jest.fn().mockRejectedValue(new Error()),
    });

    let err: Error;

    try {
      await interceptor.intercept(
        mockedExecutionContext as unknown as ExecutionContext,
        {} as CallHandler,
      );
    } catch (error) {
      err = error;
    }

    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(2);
    expect(mockedExecutionContext.getHandler).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.getClass).toHaveBeenCalledTimes(1);
    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(mockedFileService.upload).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(Error);
  });

  it('should attach file key into response', async () => {
    const mockedFileFieldName = faker.string.alpha({
      casing: 'lower',
    });
    const mockedFilename = faker.system.fileName();
    const mockedFileMimeType = faker.system.mimeType();
    const mockedFileSize = faker.number.int();

    const mockedResponse = {};

    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        isMultipart: jest.fn().mockReturnValue(true),
        file: jest.fn().mockResolvedValue({
          fieldname: mockedFileFieldName,
          filename: mockedFilename,
          mimetype: mockedFileMimeType,
        }),
      }),
      getResponse: jest.fn().mockReturnValue(mockedResponse),
    });
    mockedExecutionContext.getHandler.mockReturnValue(jest.fn());
    mockedExecutionContext.getClass.mockReturnValue({});
    mockedReflector.getAllAndOverride.mockReturnValue({
      field: mockedFileFieldName,
      type: [
        {
          mimeType: mockedFileMimeType,
          extensions: [path.extname(mockedFilename)],
        },
      ],
      size: mockedFileSize,
    });

    const expectedFileKey = faker.string.alphanumeric();

    mockedFileService.upload.mockReturnValue({
      on: jest
        .fn()
        .mockImplementation((__, cb) => cb({ loaded: mockedFileSize })),
      abort: jest.fn().mockResolvedValue(undefined),
      done: jest.fn().mockResolvedValue({
        Key: expectedFileKey,
      }),
    });

    const mockedCallHandler = {
      handle: () => of(),
    };

    await interceptor.intercept(
      mockedExecutionContext as unknown as ExecutionContext,
      mockedCallHandler as CallHandler,
    );

    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(2);
    expect(mockedExecutionContext.getHandler).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.getClass).toHaveBeenCalledTimes(1);
    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(mockedFileService.upload).toHaveBeenCalledTimes(1);

    expect(mockedLodash.set).toHaveBeenCalledWith(
      mockedResponse,
      'file.key',
      expectedFileKey,
    );
  });
});
