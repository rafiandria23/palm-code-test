import _ from 'lodash';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { faker } from '@faker-js/faker';

import {
  PaginationPage,
  PaginationSize,
  SortDirection,
} from '../common/common.constant';
import { DbTransactionInterceptor } from '../common/common.interceptor';
import { CommonService } from '../common/common.service';

import { UserSortProperty } from './user.constant';
import { UserService } from './user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;

  const mockedDbTransaction: SequelizeTransaction = {} as SequelizeTransaction;

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
      .overrideInterceptor(DbTransactionInterceptor)
      .useValue(mockedDbTransaction)
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
    it('should return users', async () => {
      mockedUserService.readAll.mockResolvedValue({
        success: true,
        data: [mockedUser],
      });

      const { success, data } = await controller.readAll(mockedDbTransaction, {
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: UserSortProperty.Id,
        email: mockedUser.email,
      });

      expect(mockedUserService.readAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([mockedUser]);
    });
  });

  describe('me', () => {
    it('should return 422 when user does not exist', async () => {
      mockedUserService.readById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.me(mockedDbTransaction, {
          user_id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserService.readById).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return user', async () => {
      mockedUserService.readById.mockResolvedValue(mockedUser);

      const { success, data } = await controller.me(mockedDbTransaction, {
        user_id: mockedUser.id,
      });

      expect(mockedUserService.readById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedUser);
    });
  });

  describe('readById', () => {
    it('should return 422 when user does not exist', async () => {
      mockedUserService.readById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.readById(mockedDbTransaction, {
          id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserService.readById).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return user', async () => {
      mockedUserService.readById.mockResolvedValue(mockedUser);

      const { success, data } = await controller.readById(
        mockedDbTransaction,
        _.pick(mockedUser, ['id']),
      );

      expect(mockedUserService.readById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedUser);
    });
  });

  describe('update', () => {
    it('should return success', async () => {
      mockedUserService.update.mockResolvedValue({ success: true });

      const { success } = await controller.update(
        mockedDbTransaction,
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
