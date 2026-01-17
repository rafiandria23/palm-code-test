import _ from 'lodash';
import { ExecutionContext } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { authFactory } from './auth.decorator';

describe('Auth decorators', () => {
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

  describe('Auth', () => {
    const authMock = {
      user_id: faker.string.uuid(),
    };

    it('should return API auth', () => {
      const requestMock = {
        auth: authMock,
      };

      executionContextMock.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue(requestMock),
      });

      const auth = authFactory(
        {},
        executionContextMock as unknown as ExecutionContext,
      );

      expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);
      expect(lodashMock.get).toHaveBeenCalledWith(requestMock, 'auth');

      expect(auth).toEqual(authMock);
    });
  });
});
