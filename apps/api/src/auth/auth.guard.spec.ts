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

  const mockedReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockedConfigService = {
    get: jest.fn(),
  };

  const mockedJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockedExecutionContext = {
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
          useValue: mockedReflector,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
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
    mockedReflector.getAllAndOverride.mockReturnValue(true);

    const result = await guard.canActivate(
      mockedExecutionContext as unknown as ExecutionContext,
    );

    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);

    expect(result).toBeTruthy();
  });

  it('should return 401 when authorization header is not found', async () => {
    mockedReflector.getAllAndOverride.mockReturnValue(false);

    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: null,
        },
      }),
    });

    let err: UnauthorizedException;

    try {
      await guard.canActivate(
        mockedExecutionContext as unknown as ExecutionContext,
      );
    } catch (error) {
      err = error;
    }

    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should return 401 when access token type is invalid', async () => {
    mockedReflector.getAllAndOverride.mockReturnValue(false);

    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: `${faker.string.alpha()} ${faker.string.alphanumeric()}`,
        },
      }),
    });

    let err: UnauthorizedException;

    try {
      await guard.canActivate(
        mockedExecutionContext as unknown as ExecutionContext,
      );
    } catch (error) {
      err = error;
    }

    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should return 401 when access token is not found', async () => {
    mockedReflector.getAllAndOverride.mockReturnValue(false);

    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer',
        },
      }),
    });

    let err: UnauthorizedException;

    try {
      await guard.canActivate(
        mockedExecutionContext as unknown as ExecutionContext,
      );
    } catch (error) {
      err = error;
    }

    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should return 401 when access token is invalid', async () => {
    mockedReflector.getAllAndOverride.mockReturnValue(false);

    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: `Bearer ${faker.string.alphanumeric()}`,
        },
      }),
    });

    mockedConfigService.get.mockReturnValue(faker.string.alphanumeric());

    mockedJwtService.verifyAsync.mockRejectedValue(
      new Error(faker.string.alpha()),
    );

    let err: UnauthorizedException;

    try {
      await guard.canActivate(
        mockedExecutionContext as unknown as ExecutionContext,
      );
    } catch (error) {
      err = error;
    }

    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(1);
    expect(mockedConfigService.get).toHaveBeenCalledTimes(1);
    expect(mockedJwtService.verifyAsync).toHaveBeenCalledTimes(1);

    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('should return true when access token is valid', async () => {
    mockedReflector.getAllAndOverride.mockReturnValue(false);

    mockedExecutionContext.switchToHttp.mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: `Bearer ${faker.string.alphanumeric()}`,
        },
      }),
    });

    mockedConfigService.get.mockReturnValue(faker.string.alphanumeric());

    mockedJwtService.verifyAsync.mockResolvedValue({});

    const result = await guard.canActivate(
      mockedExecutionContext as unknown as ExecutionContext,
    );

    expect(mockedReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
    expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(1);
    expect(mockedConfigService.get).toHaveBeenCalledTimes(1);
    expect(mockedJwtService.verifyAsync).toHaveBeenCalledTimes(1);

    expect(result).toBeTruthy();
  });
});
