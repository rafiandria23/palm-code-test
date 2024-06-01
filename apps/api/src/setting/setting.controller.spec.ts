import _ from 'lodash';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';

import {
  PaginationPage,
  PaginationSize,
  SortDirection,
} from '../common/constants/pagination.constant';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { CommonService } from '../common/common.service';

import {
  CountrySortProperty,
  SurfboardSortProperty,
} from './constants/read.constant';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

describe('SettingController', () => {
  let controller: SettingController;

  const mockedSettingService = {
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
          useValue: mockedSettingService,
        },
      ],
    })
      .overrideInterceptor(TransactionInterceptor)
      .useValue({})
      .compile();

    controller = module.get<SettingController>(SettingController);
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  const mockedCountry = {
    id: faker.string.uuid(),
    name: faker.string.alpha(),
    code: faker.string.alphanumeric(),
    dial_code: faker.string.alphanumeric(),
    emoji: faker.string.alphanumeric(),
  };

  const mockedSurfboard = {
    id: faker.string.uuid(),
    name: faker.string.alpha(),
  };

  describe('createCountry', () => {
    it('should return created country', async () => {
      mockedSettingService.createCountry.mockResolvedValue({
        success: true,
        data: mockedCountry,
      });

      const { success, data } = await controller.createCountry(
        _.omit(mockedCountry, ['id']),
      );

      expect(mockedSettingService.createCountry).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedCountry);
    });
  });

  describe('createSurfboard', () => {
    it('should return created surfboard', async () => {
      mockedSettingService.createSurfboard.mockResolvedValue({
        success: true,
        data: mockedSurfboard,
      });

      const { success, data } = await controller.createSurfboard(
        _.omit(mockedSurfboard, ['id']),
      );

      expect(mockedSettingService.createSurfboard).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedSurfboard);
    });
  });

  describe('readAllCountries', () => {
    it('should return countries', async () => {
      mockedSettingService.readAllCountries.mockResolvedValue({
        success: true,
        data: [mockedCountry],
      });

      const { success, data } = await controller.readAllCountries({
        page: PaginationPage.MIN,
        page_size: PaginationSize.MAX,
        sort: SortDirection.ASC,
        sort_by: CountrySortProperty.ID,
        name: mockedCountry.name,
      });

      expect(mockedSettingService.readAllCountries).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([mockedCountry]);
    });
  });

  describe('readCountryById', () => {
    it('should return 422 when country does not exist', async () => {
      mockedSettingService.readCountryById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.readCountryById({
          id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return country', async () => {
      mockedSettingService.readCountryById.mockResolvedValue(mockedCountry);

      const { success, data } = await controller.readCountryById(
        _.pick(mockedCountry, ['id']),
      );

      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedCountry);
    });
  });

  describe('readAllSurfboards', () => {
    it('should return surfboards', async () => {
      mockedSettingService.readAllSurfboards.mockResolvedValue({
        success: true,
        data: [mockedSurfboard],
      });

      const { success, data } = await controller.readAllSurfboards({
        page: PaginationPage.MIN,
        page_size: PaginationSize.MAX,
        sort: SortDirection.ASC,
        sort_by: SurfboardSortProperty.ID,
        name: mockedSurfboard.name,
      });

      expect(mockedSettingService.readAllSurfboards).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([mockedSurfboard]);
    });
  });

  describe('readSurfboardById', () => {
    it('should return 422 when surfboard does not exist', async () => {
      mockedSettingService.readSurfboardById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.readSurfboardById({
          id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return surfboard', async () => {
      mockedSettingService.readSurfboardById.mockResolvedValue(mockedSurfboard);

      const { success, data } = await controller.readSurfboardById(
        _.pick(mockedSurfboard, ['id']),
      );

      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedSurfboard);
    });
  });

  describe('updateCountry', () => {
    it('should return success', async () => {
      mockedSettingService.updateCountry.mockResolvedValue({ success: true });

      const { success } = await controller.updateCountry(
        _.pick(mockedCountry, ['id']),
        {
          name: faker.string.alpha(),
          code: faker.string.alphanumeric(),
          dial_code: faker.string.alphanumeric(),
          emoji: faker.string.alphanumeric(),
        },
      );

      expect(mockedSettingService.updateCountry).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('updateSurfboard', () => {
    it('should return success', async () => {
      mockedSettingService.updateSurfboard.mockResolvedValue({ success: true });

      const { success } = await controller.updateSurfboard(
        _.pick(mockedSurfboard, ['id']),
        {
          name: faker.string.alpha(),
        },
      );

      expect(mockedSettingService.updateSurfboard).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deleteCountry', () => {
    it('should return success', async () => {
      mockedSettingService.deleteCountry.mockResolvedValue({ success: true });

      const { success } = await controller.deleteCountry(
        _.pick(mockedCountry, ['id']),
      );

      expect(mockedSettingService.deleteCountry).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deleteSurfboard', () => {
    it('should return success', async () => {
      mockedSettingService.deleteSurfboard.mockResolvedValue({
        success: true,
      });

      const { success } = await controller.deleteSurfboard(
        _.pick(mockedSurfboard, ['id']),
      );

      expect(mockedSettingService.deleteSurfboard).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
