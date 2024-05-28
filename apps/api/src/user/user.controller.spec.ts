import _ from 'lodash';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { CommonService } from '../common/common.service';

import { UserService } from './user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;

  const mockedUserService = {
    readAll: jest.fn(),
    readById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        ConfigService,
        CommonService,
        {
          provide: UserService,
          useValue: mockedUserService,
        },
      ],
    })
      .overrideInterceptor(TransactionInterceptor)
      .useValue({})
      .compile();

    controller = module.get<UserController>(UserController);
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

  describe('readAll', () => {
    it('should return success', async () => {
      mockedUserService.readAll.mockResolvedValue({ success: true });

      const { success } = await controller.readAll({});

      expect(mockedUserService.readAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('me', () => {
    it('should return 422 when user does not exist', async () => {
      mockedUserService.readById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.me({
          user_id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserService.readById).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      mockedUserService.readById.mockResolvedValue(mockedUser);

      const { success } = await controller.me({
        user_id: mockedUser.id,
      });

      expect(mockedUserService.readById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('readById', () => {
    it('should return 422 when user does not exist', async () => {
      mockedUserService.readById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.readById({
          id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserService.readById).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      mockedUserService.readById.mockResolvedValue(mockedUser);

      const { success } = await controller.readById(_.pick(mockedUser, ['id']));

      expect(mockedUserService.readById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('update', () => {
    it('should return success', async () => {
      mockedUserService.update.mockResolvedValue({ success: true });

      const { success } = await controller.update(
        {
          user_id: mockedUser.id,
        },
        {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
        },
      );

      expect(mockedUserService.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
