import _ from 'lodash';
import { ExecutionContext } from '@nestjs/common';

import { dbTransactionFactory } from './common.decorator';

describe('Common decorators', () => {
  const mockedExecutionContext = {
    switchToHttp: jest.fn(),
  };

  const mockedLodash = {
    get: jest.spyOn(_, 'get'),
  };

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe('DbTransaction', () => {
    const mockedDbTransaction = {};

    it('should return API DB transaction', () => {
      const mockedRequest = {
        db: {
          transaction: mockedDbTransaction,
        },
      };

      mockedExecutionContext.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockedRequest),
      });

      const dbTransaction = dbTransactionFactory(
        {},
        mockedExecutionContext as unknown as ExecutionContext,
      );

      expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(1);
      expect(mockedLodash.get).toHaveBeenCalledWith(
        mockedRequest,
        'db.transaction',
      );

      expect(dbTransaction).toEqual(mockedDbTransaction);
    });
  });
});
