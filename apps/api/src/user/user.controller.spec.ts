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

  const dbTransactionMock: SequelizeTransaction = {} as SequelizeTransaction;

  const userServiceMock = {
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
          useValue: userServiceMock,
        },
      ],
    })
      .overrideInterceptor(DbTransactionInterceptor)
      .useValue(dbTransactionMock)
      .compile();

    controller = module.get<UserController>(UserController);
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

  describe('readAll', () => {
    it('should return users', async () => {
      userServiceMock.readAll.mockResolvedValue({
        success: true,
        data: [userMock],
      });

      const { success, data } = await controller.readAll(dbTransactionMock, {
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: UserSortProperty.Id,
        email: userMock.email,
      });

      expect(userServiceMock.readAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([userMock]);
    });
  });

  describe('me', () => {
    it('should return 422 when user does not exist', async () => {
      userServiceMock.readById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.me(dbTransactionMock, {
          user_id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(userServiceMock.readById).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return user', async () => {
      userServiceMock.readById.mockResolvedValue(userMock);

      const { success, data } = await controller.me(dbTransactionMock, {
        user_id: userMock.id,
      });

      expect(userServiceMock.readById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(userMock);
    });
  });

  describe('readById', () => {
    it('should return 422 when user does not exist', async () => {
      userServiceMock.readById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.readById(dbTransactionMock, {
          id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(userServiceMock.readById).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return user', async () => {
      userServiceMock.readById.mockResolvedValue(userMock);

      const { success, data } = await controller.readById(
        dbTransactionMock,
        _.pick(userMock, ['id']),
      );

      expect(userServiceMock.readById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(userMock);
    });
  });

  describe('update', () => {
    it('should return success', async () => {
      userServiceMock.update.mockResolvedValue({ success: true });

      const { success } = await controller.update(
        dbTransactionMock,
        {
          user_id: userMock.id,
        },
        {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
        },
      );

      expect(userServiceMock.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
