import _ from 'lodash';
import { ExecutionContext } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { uploadedFileFactory } from './file.decorator';

describe('File decorators', () => {
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

  describe('UploadedFile', () => {
    const mockedFile = {
      key: faker.string.alphanumeric(),
    };

    it('should return API file', () => {
      const mockedResponse = {
        file: mockedFile,
      };

      mockedExecutionContext.switchToHttp.mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockedResponse),
      });

      const file = uploadedFileFactory(
        {},
        mockedExecutionContext as unknown as ExecutionContext,
      );

      expect(mockedExecutionContext.switchToHttp).toHaveBeenCalledTimes(1);
      expect(mockedLodash.get).toHaveBeenCalledWith(mockedResponse, 'file');

      expect(file).toEqual(mockedFile);
    });
  });
});
