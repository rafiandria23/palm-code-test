import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { of, throwError } from 'rxjs';

import { DbTransactionInterceptor } from './common.interceptor';

describe('Common interceptors', () => {
  const mockedExecutionContext = {
    switchToHttp: jest.fn(),
  };

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe('DbTransactionInterceptor', () => {
    let interceptor: DbTransactionInterceptor;

    const mockedSequelize = {
      transaction: jest.fn(),
    };

    beforeEach(() => {
      interceptor = new DbTransactionInterceptor(
        mockedSequelize as unknown as Sequelize,
      );
    });

    it('should commit API DB transaction', async () => {
      mockedExecutionContext.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      });

      mockedSequelize.transaction.mockResolvedValue({
        commit: jest.fn().mockResolvedValue(undefined),
      });

      const mockedCallHandler = {
        handle: () => of(undefined),
      };

      (
        await interceptor.intercept(
          mockedExecutionContext as unknown as ExecutionContext,
          mockedCallHandler as CallHandler,
        )
      )
        .subscribe({
          next: () => {
            expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(
              1,
            );
          },
        })
        .unsubscribe();

      expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(1);
      expect(mockedSequelize.transaction).toHaveBeenCalledTimes(1);
    });

    it('should rollback API DB transaction and throw error', async () => {
      mockedExecutionContext.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      });

      mockedSequelize.transaction.mockResolvedValue({
        rollback: jest.fn().mockResolvedValue(undefined),
      });

      const mockedCallHandler = {
        handle: () => throwError(() => new Error()),
      };

      (
        await interceptor.intercept(
          mockedExecutionContext as unknown as ExecutionContext,
          mockedCallHandler as CallHandler,
        )
      )
        .subscribe({
          error: (err) => {
            expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(
              1,
            );
            expect(mockedSequelize.transaction).toHaveBeenCalledTimes(1);

            expect(err).toBeDefined();
          },
        })
        .unsubscribe();
    });
  });
});
