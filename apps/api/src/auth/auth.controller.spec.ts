import _ from 'lodash';
import { Test, TestingModule } from '@nestjs/testing';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { faker } from '@faker-js/faker';

import { DbTransactionInterceptor } from '../common/common.interceptor';

import { PasswordLength } from './auth.constant';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  const mockedDbTransaction: SequelizeTransaction = {} as SequelizeTransaction;

  const mockedAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    updateEmail: jest.fn(),
    updatePassword: jest.fn(),
    deactivate: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockedAuthService,
        },
      ],
    })
      .overrideInterceptor(DbTransactionInterceptor)
      .useValue(mockedDbTransaction)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  const mockedUser = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
  };

  const mockedUserPassword = {
    id: faker.string.uuid(),
    user_id: mockedUser.id,
    password: faker.internet.password({
      length: PasswordLength.Min,
    }),
  };

  const mockedAuthToken = {
    access_token: faker.string.alphanumeric(),
  };

  describe('signUp', () => {
    it('should return auth token', async () => {
      mockedAuthService.signUp.mockResolvedValue({
        success: true,
        data: mockedAuthToken,
      });

      const { success, data } = await controller.signUp(mockedDbTransaction, {
        ..._.omit(mockedUser, ['id']),
        ..._.pick(mockedUserPassword, ['password']),
      });

      expect(mockedAuthService.signUp).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedAuthToken);
    });
  });

  describe('signIn', () => {
    it('should return auth token', async () => {
      mockedAuthService.signIn.mockResolvedValue({
        success: true,
        data: mockedAuthToken,
      });

      const { success, data } = await controller.signIn(mockedDbTransaction, {
        ..._.pick(mockedUser, ['email']),
        ..._.pick(mockedUserPassword, ['password']),
      });

      expect(mockedAuthService.signIn).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedAuthToken);
    });
  });

  describe('updateEmail', () => {
    it('should return success', async () => {
      mockedAuthService.updateEmail.mockResolvedValue({ success: true });

      const { success } = await controller.updateEmail(
        mockedDbTransaction,
        {
          user_id: mockedUser.id,
        },
        {
          email: faker.internet.email(),
        },
      );

      expect(mockedAuthService.updateEmail).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('updatePassword', () => {
    it('should return success', async () => {
      mockedAuthService.updatePassword.mockResolvedValue({ success: true });

      const { success } = await controller.updatePassword(
        mockedDbTransaction,
        {
          user_id: mockedUser.id,
        },
        {
          old_password: mockedUserPassword.password,
          new_password: faker.internet.password({
            length: PasswordLength.Min,
          }),
        },
      );

      expect(mockedAuthService.updatePassword).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deactivate', () => {
    it('should return success', async () => {
      mockedAuthService.deactivate.mockResolvedValue({ success: true });

      const { success } = await controller.deactivate(mockedDbTransaction, {
        user_id: mockedUser.id,
      });

      expect(mockedAuthService.deactivate).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should return success', async () => {
      mockedAuthService.delete.mockResolvedValue({ success: true });

      const { success } = await controller.delete(mockedDbTransaction, {
        user_id: mockedUser.id,
      });

      expect(mockedAuthService.delete).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
