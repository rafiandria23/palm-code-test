import _ from 'lodash';
import { ExecutionContext } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { authFactory } from './auth.decorator';

describe('Auth decorators', () => {
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

  describe('Auth', () => {
    const mockedAuth = {
      user_id: faker.string.uuid(),
    };

    it('should return API auth', () => {
      const mockedRequest = {
        auth: mockedAuth,
      };

      mockedExecutionContext.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockedRequest),
      });

      const auth = authFactory(
        {},
        mockedExecutionContext as unknown as ExecutionContext,
      );

      expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(1);
      expect(mockedLodash.get).toHaveBeenCalledWith(mockedRequest, 'auth');

      expect(auth).toEqual(mockedAuth);
    });
  });
});
