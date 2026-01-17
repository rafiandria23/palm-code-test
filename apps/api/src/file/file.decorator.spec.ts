import _ from 'lodash';
import { ExecutionContext } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { uploadedFileFactory } from './file.decorator';

describe('File decorators', () => {
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

  describe('UploadedFile', () => {
    const fileMock = {
      key: faker.string.alphanumeric(),
    };

    it('should return API file', () => {
      const responseMock = {
        file: fileMock,
      };

      executionContextMock.switchToHttp.mockReturnValue({
        getResponse: jest.fn().mockReturnValue(responseMock),
      });

      const file = uploadedFileFactory(
        {},
        executionContextMock as unknown as ExecutionContext,
      );

      expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);
      expect(lodashMock.get).toHaveBeenCalledWith(responseMock, 'file');

      expect(file).toEqual(fileMock);
    });
  });
});
