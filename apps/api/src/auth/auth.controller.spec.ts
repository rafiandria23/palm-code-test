import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

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
      .overrideInterceptor(TransactionInterceptor)
      .useValue({})
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe('signUp', () => {
    it('should return success', async () => {
      mockedAuthService.signUp.mockResolvedValue({ success: true });

      const { success } = await controller.signUp({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 6,
        }),
      });

      expect(mockedAuthService.signUp).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('signIn', () => {
    it('should return success', async () => {
      mockedAuthService.signIn.mockResolvedValue({ success: true });

      const { success } = await controller.signIn({
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 6,
        }),
      });

      expect(mockedAuthService.signIn).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('updateEmail', () => {
    it('should return success', async () => {
      mockedAuthService.updateEmail.mockResolvedValue({ success: true });

      const { success } = await controller.updateEmail(
        {
          user_id: faker.string.uuid(),
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
        {
          user_id: faker.string.uuid(),
        },
        {
          old_password: faker.internet.password({
            length: 6,
          }),
          new_password: faker.internet.password({
            length: 6,
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

      const { success } = await controller.deactivate({
        user_id: faker.string.uuid(),
      });

      expect(mockedAuthService.deactivate).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should return success', async () => {
      mockedAuthService.delete.mockResolvedValue({ success: true });

      const { success } = await controller.delete({
        user_id: faker.string.uuid(),
      });

      expect(mockedAuthService.delete).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
