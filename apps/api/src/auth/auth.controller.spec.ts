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

  const dbTransactionMock: SequelizeTransaction = {} as SequelizeTransaction;

  const authServiceMock = {
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
          useValue: authServiceMock,
        },
      ],
    })
      .overrideInterceptor(DbTransactionInterceptor)
      .useValue(dbTransactionMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  const userMock = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
  };

  const userPasswordMock = {
    id: faker.string.uuid(),
    user_id: userMock.id,
    password: faker.internet.password({
      length: PasswordLength.Min,
    }),
  };

  const authTokenMock = {
    access_token: faker.string.alphanumeric(),
  };

  describe('signUp', () => {
    it('should return auth token', async () => {
      authServiceMock.signUp.mockResolvedValue({
        success: true,
        data: authTokenMock,
      });

      const { success, data } = await controller.signUp(dbTransactionMock, {
        ..._.omit(userMock, ['id']),
        ..._.pick(userPasswordMock, ['password']),
      });

      expect(authServiceMock.signUp).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(authTokenMock);
    });
  });

  describe('signIn', () => {
    it('should return auth token', async () => {
      authServiceMock.signIn.mockResolvedValue({
        success: true,
        data: authTokenMock,
      });

      const { success, data } = await controller.signIn(dbTransactionMock, {
        ..._.pick(userMock, ['email']),
        ..._.pick(userPasswordMock, ['password']),
      });

      expect(authServiceMock.signIn).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(authTokenMock);
    });
  });

  describe('updateEmail', () => {
    it('should return success', async () => {
      authServiceMock.updateEmail.mockResolvedValue({ success: true });

      const { success } = await controller.updateEmail(
        dbTransactionMock,
        {
          user_id: userMock.id,
        },
        {
          email: faker.internet.email(),
        },
      );

      expect(authServiceMock.updateEmail).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('updatePassword', () => {
    it('should return success', async () => {
      authServiceMock.updatePassword.mockResolvedValue({ success: true });

      const { success } = await controller.updatePassword(
        dbTransactionMock,
        {
          user_id: userMock.id,
        },
        {
          old_password: userPasswordMock.password,
          new_password: faker.internet.password({
            length: PasswordLength.Min,
          }),
        },
      );

      expect(authServiceMock.updatePassword).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deactivate', () => {
    it('should return success', async () => {
      authServiceMock.deactivate.mockResolvedValue({ success: true });

      const { success } = await controller.deactivate(dbTransactionMock, {
        user_id: userMock.id,
      });

      expect(authServiceMock.deactivate).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should return success', async () => {
      authServiceMock.delete.mockResolvedValue({ success: true });

      const { success } = await controller.delete(dbTransactionMock, {
        user_id: userMock.id,
      });

      expect(authServiceMock.delete).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
