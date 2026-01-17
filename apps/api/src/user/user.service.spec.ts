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
} from '../common/common.constant';
import { CommonService } from '../common/common.service';

import { User } from './models/user.model';
import { UserSortProperty } from './user.constant';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const userModelMock = {
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
          useValue: userModelMock,
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

  const userMock = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
  };

  describe('create', () => {
    it('should return user', async () => {
      userModelMock.create.mockResolvedValue(userMock);

      const result = await service.create(_.omit(userMock, ['id']));

      expect(userModelMock.create).toHaveBeenCalledTimes(1);

      expect(result).toEqual(userMock);
    });
  });

  describe('readAll', () => {
    it('should return users without filters', async () => {
      userModelMock.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [userMock],
      });

      const { success, data } = await service.readAll({
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: UserSortProperty.Id,
      });

      expect(userModelMock.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([userMock]);
    });

    it('should return users with filters', async () => {
      userModelMock.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [userMock],
      });

      const { success, data } = await service.readAll({
        page: faker.number.int(),
        page_size: faker.number.int(),
        sort: SortDirection.Asc,
        sort_by: UserSortProperty.Id,
        email: userMock.email,
      });

      expect(userModelMock.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([userMock]);
    });
  });

  describe('readById', () => {
    it('should return user', async () => {
      userModelMock.findByPk.mockResolvedValue(userMock);

      const result = await service.readById(userMock.id);

      expect(userModelMock.findByPk).toHaveBeenCalledTimes(1);

      expect(result).toEqual(userMock);
    });
  });

  describe('readByEmail', () => {
    it('should return user', async () => {
      userModelMock.findOne.mockResolvedValue(userMock);

      const result = await service.readByEmail(userMock.email);

      expect(userModelMock.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual(userMock);
    });
  });

  describe('update', () => {
    it('should return 422 when user does not exist', async () => {
      userModelMock.update.mockResolvedValue([0]);

      let err: UnprocessableEntityException;

      try {
        await service.update(faker.string.uuid(), {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
        });
      } catch (error) {
        err = error;
      }

      expect(userModelMock.update).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      userModelMock.update.mockResolvedValue([1]);

      const { success } = await service.update(userMock.id, {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
      });

      expect(userModelMock.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('updateEmail', () => {
    it('should return 422 when user does not exist', async () => {
      userModelMock.update.mockResolvedValue([0]);

      let err: UnprocessableEntityException;

      try {
        await service.updateEmail(faker.string.uuid(), {
          email: faker.internet.email(),
        });
      } catch (error) {
        err = error;
      }

      expect(userModelMock.update).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return void as success', async () => {
      userModelMock.update.mockResolvedValue([1]);

      await service.updateEmail(userMock.id, {
        email: faker.internet.email(),
      });

      expect(userModelMock.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should return 422 when user does not exist', async () => {
      userModelMock.destroy.mockResolvedValue(0);

      let err: UnprocessableEntityException;

      try {
        await service.delete(faker.string.uuid());
      } catch (error) {
        err = error;
      }

      expect(userModelMock.destroy).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return void as success', async () => {
      userModelMock.destroy.mockResolvedValue(1);

      await service.delete(userMock.id);

      expect(userModelMock.destroy).toHaveBeenCalledTimes(1);
    });
  });
});
