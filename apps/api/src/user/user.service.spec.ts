import _ from 'lodash';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/sequelize';
import { faker } from '@faker-js/faker';

import {
  PaginationPage,
  PaginationSize,
  SortDirection,
} from '../common/constants/pagination.constant';
import { CommonService } from '../common/common.service';

import { User } from './models/user.model';
import { UserSortProperty } from './constants/read.constant';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockedUserModel = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: mockedUserModel,
        },
        ConfigService,
        CommonService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
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

  describe('create', () => {
    it('should return user', async () => {
      mockedUserModel.create.mockResolvedValue(mockedUser);

      const result = await service.create(_.omit(mockedUser, ['id']));

      expect(mockedUserModel.create).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockedUser);
    });
  });

  describe('readAll', () => {
    it('should return users without filters', async () => {
      mockedUserModel.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [mockedUser],
      });

      const { success, data } = await service.readAll({
        page: PaginationPage.MIN,
        page_size: PaginationSize.MAX,
        sort: SortDirection.ASC,
        sort_by: UserSortProperty.ID,
      });

      expect(mockedUserModel.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([mockedUser]);
    });

    it('should return users with filters', async () => {
      mockedUserModel.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [mockedUser],
      });

      const { success, data } = await service.readAll({
        page: faker.number.int(),
        page_size: faker.number.int(),
        sort: SortDirection.ASC,
        sort_by: UserSortProperty.ID,
        email: mockedUser.email,
      });

      expect(mockedUserModel.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([mockedUser]);
    });
  });

  describe('readById', () => {
    it('should return user', async () => {
      mockedUserModel.findByPk.mockResolvedValue(mockedUser);

      const result = await service.readById(mockedUser.id);

      expect(mockedUserModel.findByPk).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockedUser);
    });
  });

  describe('readByEmail', () => {
    it('should return user', async () => {
      mockedUserModel.findOne.mockResolvedValue(mockedUser);

      const result = await service.readByEmail(mockedUser.email);

      expect(mockedUserModel.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockedUser);
    });
  });

  describe('update', () => {
    it('should return 422 when user does not exist', async () => {
      mockedUserModel.update.mockResolvedValue([0]);

      let err: UnprocessableEntityException;

      try {
        await service.update(faker.string.uuid(), {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserModel.update).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      mockedUserModel.update.mockResolvedValue([1]);

      const { success } = await service.update(mockedUser.id, {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
      });

      expect(mockedUserModel.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('updateEmail', () => {
    it('should return 422 when user does not exist', async () => {
      mockedUserModel.update.mockResolvedValue([0]);

      let err: UnprocessableEntityException;

      try {
        await service.updateEmail(faker.string.uuid(), {
          email: faker.internet.email(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedUserModel.update).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return void as success', async () => {
      mockedUserModel.update.mockResolvedValue([1]);

      await service.updateEmail(mockedUser.id, {
        email: faker.internet.email(),
      });

      expect(mockedUserModel.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return 422 when user does not exist', async () => {
      mockedUserModel.destroy.mockResolvedValue(0);

      let err: UnprocessableEntityException;

      try {
        await service.delete(faker.string.uuid());
      } catch (error) {
        err = error;
      }

      expect(mockedUserModel.destroy).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return void as success', async () => {
      mockedUserModel.destroy.mockResolvedValue(1);

      await service.delete(mockedUser.id);

      expect(mockedUserModel.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
