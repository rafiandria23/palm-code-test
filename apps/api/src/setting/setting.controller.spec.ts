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

import { CountrySortProperty, SurfboardSortProperty } from './setting.constant';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

describe('SettingController', () => {
  let controller: SettingController;

  const dbTransactionMock: SequelizeTransaction = {} as SequelizeTransaction;

  const settingServiceMock = {
    createCountry: jest.fn(),
    createSurfboard: jest.fn(),
    readAllCountries: jest.fn(),
    readCountryById: jest.fn(),
    readAllSurfboards: jest.fn(),
    readSurfboardById: jest.fn(),
    updateCountry: jest.fn(),
    updateSurfboard: jest.fn(),
    deleteCountry: jest.fn(),
    deleteSurfboard: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingController],
      providers: [
        ConfigService,
        CommonService,
        {
          provide: SettingService,
          useValue: settingServiceMock,
        },
      ],
    })
      .overrideInterceptor(DbTransactionInterceptor)
      .useValue(dbTransactionMock)
      .compile();

    controller = module.get<SettingController>(SettingController);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  const countryMock = {
    id: faker.string.uuid(),
    name: faker.string.alpha(),
    code: faker.string.alphanumeric(),
    dial_code: faker.string.alphanumeric(),
    emoji: faker.string.alphanumeric(),
  };

  const surfboardMock = {
    id: faker.string.uuid(),
    name: faker.string.alpha(),
  };

  describe('createCountry', () => {
    it('should return created country', async () => {
      settingServiceMock.createCountry.mockResolvedValue({
        success: true,
        data: countryMock,
      });

      const { success, data } = await controller.createCountry(
        dbTransactionMock,
        _.omit(countryMock, ['id']),
      );

      expect(settingServiceMock.createCountry).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(countryMock);
    });
  });

  describe('createSurfboard', () => {
    it('should return created surfboard', async () => {
      settingServiceMock.createSurfboard.mockResolvedValue({
        success: true,
        data: surfboardMock,
      });

      const { success, data } = await controller.createSurfboard(
        dbTransactionMock,
        _.omit(surfboardMock, ['id']),
      );

      expect(settingServiceMock.createSurfboard).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(surfboardMock);
    });
  });

  describe('readAllCountries', () => {
    it('should return countries', async () => {
      settingServiceMock.readAllCountries.mockResolvedValue({
        success: true,
        data: [countryMock],
      });

      const { success, data } = await controller.readAllCountries(
        dbTransactionMock,
        {
          page: PaginationPage.Min,
          page_size: PaginationSize.Max,
          sort: SortDirection.Asc,
          sort_by: CountrySortProperty.Id,
          name: countryMock.name,
        },
      );

      expect(settingServiceMock.readAllCountries).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([countryMock]);
    });
  });

  describe('readCountryById', () => {
    it('should return 422 when country does not exist', async () => {
      settingServiceMock.readCountryById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.readCountryById(dbTransactionMock, {
          id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return country', async () => {
      settingServiceMock.readCountryById.mockResolvedValue(countryMock);

      const { success, data } = await controller.readCountryById(
        dbTransactionMock,
        _.pick(countryMock, ['id']),
      );

      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(countryMock);
    });
  });

  describe('readAllSurfboards', () => {
    it('should return surfboards', async () => {
      settingServiceMock.readAllSurfboards.mockResolvedValue({
        success: true,
        data: [surfboardMock],
      });

      const { success, data } = await controller.readAllSurfboards(
        dbTransactionMock,
        {
          page: PaginationPage.Min,
          page_size: PaginationSize.Max,
          sort: SortDirection.Asc,
          sort_by: SurfboardSortProperty.Id,
          name: surfboardMock.name,
        },
      );

      expect(settingServiceMock.readAllSurfboards).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([surfboardMock]);
    });
  });

  describe('readSurfboardById', () => {
    it('should return 422 when surfboard does not exist', async () => {
      settingServiceMock.readSurfboardById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.readSurfboardById(dbTransactionMock, {
          id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return surfboard', async () => {
      settingServiceMock.readSurfboardById.mockResolvedValue(surfboardMock);

      const { success, data } = await controller.readSurfboardById(
        dbTransactionMock,
        _.pick(surfboardMock, ['id']),
      );

      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(surfboardMock);
    });
  });

  describe('updateCountry', () => {
    it('should return success', async () => {
      settingServiceMock.updateCountry.mockResolvedValue({ success: true });

      const { success } = await controller.updateCountry(
        dbTransactionMock,
        _.pick(countryMock, ['id']),
        {
          name: faker.string.alpha(),
          code: faker.string.alphanumeric(),
          dial_code: faker.string.alphanumeric(),
          emoji: faker.string.alphanumeric(),
        },
      );

      expect(settingServiceMock.updateCountry).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('updateSurfboard', () => {
    it('should return success', async () => {
      settingServiceMock.updateSurfboard.mockResolvedValue({ success: true });

      const { success } = await controller.updateSurfboard(
        dbTransactionMock,
        _.pick(surfboardMock, ['id']),
        {
          name: faker.string.alpha(),
        },
      );

      expect(settingServiceMock.updateSurfboard).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deleteCountry', () => {
    it('should return success', async () => {
      settingServiceMock.deleteCountry.mockResolvedValue({ success: true });

      const { success } = await controller.deleteCountry(
        dbTransactionMock,
        _.pick(countryMock, ['id']),
      );

      expect(settingServiceMock.deleteCountry).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deleteSurfboard', () => {
    it('should return success', async () => {
      settingServiceMock.deleteSurfboard.mockResolvedValue({
        success: true,
      });

      const { success } = await controller.deleteSurfboard(
        dbTransactionMock,
        _.pick(surfboardMock, ['id']),
      );

      expect(settingServiceMock.deleteSurfboard).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
