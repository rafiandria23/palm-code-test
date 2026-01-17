import _ from 'lodash';
import { ExecutionContext } from '@nestjs/common';

import { dbTransactionFactory } from './common.decorator';

describe('Common decorators', () => {
  const executionContextMock = {
    switchToHttp: jest.fn(),
  };

  const lodashMock = {
    get: jest.spyOn(_, 'get'),
  };

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe('DbTransaction', () => {
    const dbTransactionMock = {};

    it('should return API DB transaction', () => {
      const requestMock = {
        db: {
          transaction: dbTransactionMock,
        },
      };

      executionContextMock.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue(requestMock),
      });

      const dbTransaction = dbTransactionFactory(
        {},
        executionContextMock as unknown as ExecutionContext,
      );

      expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);
      expect(lodashMock.get).toHaveBeenCalledWith(
        requestMock,
        'db.transaction',
      );

      expect(dbTransaction).toEqual(dbTransactionMock);
    });
  });
});
