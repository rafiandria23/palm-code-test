import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { of, throwError } from 'rxjs';

import { DbTransactionInterceptor } from './common.interceptor';

describe('Common interceptors', () => {
  const executionContextMock = {
    switchToHttp: jest.fn(),
  };

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe('DbTransactionInterceptor', () => {
    let interceptor: DbTransactionInterceptor;

    const sequelizeMock = {
      transaction: jest.fn(),
    };

    beforeEach(() => {
      interceptor = new DbTransactionInterceptor(
        sequelizeMock as unknown as Sequelize,
      );
    });

    it('should commit API DB transaction', async () => {
      executionContextMock.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      });

      sequelizeMock.transaction.mockResolvedValue({
        commit: jest.fn().mockResolvedValue(undefined),
      });

      const callHandlerMock = {
        handle: () => of(undefined),
      };

      (
        await interceptor.intercept(
          executionContextMock as unknown as ExecutionContext,
          callHandlerMock as CallHandler,
        )
      )
        .subscribe({
          next: () => {
            expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);
          },
        })
        .unsubscribe();

      expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);
      expect(sequelizeMock.transaction).toHaveBeenCalledTimes(1);
    });

    it('should rollback API DB transaction and throw error', async () => {
      executionContextMock.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      });

      sequelizeMock.transaction.mockResolvedValue({
        rollback: jest.fn().mockResolvedValue(undefined),
      });

      const callHandlerMock = {
        handle: () => throwError(() => new Error()),
      };

      (
        await interceptor.intercept(
          executionContextMock as unknown as ExecutionContext,
          callHandlerMock as CallHandler,
        )
      )
        .subscribe({
          error: (err) => {
            expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);
            expect(sequelizeMock.transaction).toHaveBeenCalledTimes(1);

            expect(err).toBeDefined();
          },
        })
        .unsubscribe();
    });
  });
});
