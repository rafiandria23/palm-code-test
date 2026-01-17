import { Reflector } from '@nestjs/core';
import {
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { AuthGuard } from './auth.guard';

describe('Auth guard', () => {
  let guard: AuthGuard;

  const reflectorMock = {
    getAllAndOverride: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const jwtServiceMock = {
    verifyAsync: jest.fn(),
  };

  const executionContextMock = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: Reflector,
          useValue: reflectorMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should return true when endpoint is public', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(true);

    const result = await guard.canActivate(
      executionContextMock as unknown as ExecutionContext,
    );

    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);

    expect(result).toBeTruthy();
  });

  it('should return 401 when authorization header is not found', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);

    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: null,
        },
      }),
    });

    let err: UnauthorizedException;

    try {
      await guard.canActivate(
        executionContextMock as unknown as ExecutionContext,
      );
    } catch (error) {
      err = error;
    }

    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should return 401 when access token type is invalid', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);

    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: `${faker.string.alpha()} ${faker.string.alphanumeric()}`,
        },
      }),
    });

    let err: UnauthorizedException;

    try {
      await guard.canActivate(
        executionContextMock as unknown as ExecutionContext,
      );
    } catch (error) {
      err = error;
    }

    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should return 401 when access token is not found', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);

    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer',
        },
      }),
    });

    let err: UnauthorizedException;

    try {
      await guard.canActivate(
        executionContextMock as unknown as ExecutionContext,
      );
    } catch (error) {
      err = error;
    }

    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should return 401 when access token is invalid', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);

    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: `Bearer ${faker.string.alphanumeric()}`,
        },
      }),
    });

    configServiceMock.get.mockReturnValue(faker.string.alphanumeric());

    jwtServiceMock.verifyAsync.mockRejectedValue(
      new Error(faker.string.alpha()),
    );

    let err: UnauthorizedException;

    try {
      await guard.canActivate(
        executionContextMock as unknown as ExecutionContext,
      );
    } catch (error) {
      err = error;
    }

    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);
    expect(configServiceMock.get).toHaveBeenCalledTimes(1);
    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should return true when access token is valid', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(false);

    executionContextMock.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: `Bearer ${faker.string.alphanumeric()}`,
        },
      }),
    });

    configServiceMock.get.mockReturnValue(faker.string.alphanumeric());

    jwtServiceMock.verifyAsync.mockResolvedValue({});

    const result = await guard.canActivate(
      executionContextMock as unknown as ExecutionContext,
    );

    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);
    expect(configServiceMock.get).toHaveBeenCalledTimes(1);
    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledTimes(1);

    expect(result).toBeTruthy();
  });
});
