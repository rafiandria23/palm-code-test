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

import {
  CountrySortProperty,
  SurfboardSortProperty,
} from './constants/read.constant';
import { Country } from './models/country.model';
import { Surfboard } from './models/surfboard.model';
import { SettingService } from './setting.service';

describe('SettingService', () => {
  let service: SettingService;

  const mockedCountryModel = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockedSurfboardModel = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingService,
        {
          provide: getModelToken(Country),
          useValue: mockedCountryModel,
        },
        {
          provide: getModelToken(Surfboard),
          useValue: mockedSurfboardModel,
        },
        ConfigService,
        CommonService,
      ],
    }).compile();

    service = module.get<SettingService>(SettingService);
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
      mockedCountryModel.create.mockResolvedValue(mockedCountry);

      const { success, data } = await service.createCountry(
        _.omit(mockedCountry, ['id']),
      );

      expect(mockedCountryModel.create).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedCountry);
    });
  });

  describe('createSurfboard', () => {
    it('should return created surfboard', async () => {
      mockedSurfboardModel.create.mockResolvedValue(mockedSurfboard);

      const { success, data } = await service.createSurfboard(
        _.omit(mockedSurfboard, ['id']),
      );

      expect(mockedSurfboardModel.create).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(mockedSurfboard);
    });
  });

  describe('readAllCountries', () => {
    it('should return countries without filters', async () => {
      mockedCountryModel.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [mockedCountry],
      });

      const { success, data } = await service.readAllCountries({
        page: PaginationPage.MIN,
        page_size: PaginationSize.MAX,
        sort: SortDirection.ASC,
        sort_by: CountrySortProperty.ID,
      });

      expect(mockedCountryModel.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([mockedCountry]);
    });

    it('should return countries with filters', async () => {
      mockedCountryModel.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [mockedCountry],
      });

      const { success, data } = await service.readAllCountries({
        page: PaginationPage.MIN,
        page_size: PaginationSize.MAX,
        sort: SortDirection.ASC,
        sort_by: CountrySortProperty.ID,
        name: mockedCountry.name,
      });

      expect(mockedCountryModel.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([mockedCountry]);
    });
  });

  describe('readCountryById', () => {
    it('should return country', async () => {
      mockedCountryModel.findByPk.mockResolvedValue(mockedCountry);

      const result = await service.readCountryById(mockedCountry.id);

      expect(mockedCountryModel.findByPk).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockedCountry);
    });
  });

  describe('readAllSurfboards', () => {
    it('should return surfboards without filters', async () => {
      mockedSurfboardModel.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [mockedSurfboard],
      });

      const { success, data } = await service.readAllSurfboards({
        page: PaginationPage.MIN,
        page_size: PaginationSize.MAX,
        sort: SortDirection.ASC,
        sort_by: SurfboardSortProperty.ID,
      });

      expect(mockedSurfboardModel.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([mockedSurfboard]);
    });

    it('should return surfboards with filters', async () => {
      mockedSurfboardModel.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [mockedSurfboard],
      });

      const { success, data } = await service.readAllSurfboards({
        page: PaginationPage.MIN,
        page_size: PaginationSize.MAX,
        sort: SortDirection.ASC,
        sort_by: SurfboardSortProperty.ID,
        name: mockedSurfboard.name,
      });

      expect(mockedSurfboardModel.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([mockedSurfboard]);
    });
  });

  describe('readSurfboardById', () => {
    it('should return country', async () => {
      mockedSurfboardModel.findByPk.mockResolvedValue(mockedSurfboard);

      const result = await service.readSurfboardById(mockedSurfboard.id);

      expect(mockedSurfboardModel.findByPk).toHaveBeenCalledTimes(1);

      expect(result).toEqual(mockedSurfboard);
    });
  });

  describe('updateCountry', () => {
    it('should return 422 when country does not exist', async () => {
      mockedCountryModel.update.mockResolvedValue([0]);

      let err: UnprocessableEntityException;

      try {
        await service.updateCountry(faker.string.uuid(), {
          name: faker.string.alpha(),
          code: faker.string.alphanumeric(),
          dial_code: faker.string.alphanumeric(),
          emoji: faker.string.alphanumeric(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedCountryModel.update).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      mockedCountryModel.update.mockResolvedValue([1]);

      const { success } = await service.updateCountry(mockedCountry.id, {
        name: faker.string.alpha(),
        code: faker.string.alphanumeric(),
        dial_code: faker.string.alphanumeric(),
        emoji: faker.string.alphanumeric(),
      });

      expect(mockedCountryModel.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('updateSurfboard', () => {
    it('should return 422 when surfboard does not exist', async () => {
      mockedSurfboardModel.update.mockResolvedValue([0]);

      let err: UnprocessableEntityException;

      try {
        await service.updateSurfboard(faker.string.uuid(), {
          name: faker.string.alpha(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedSurfboardModel.update).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      mockedSurfboardModel.update.mockResolvedValue([1]);

      const { success } = await service.updateSurfboard(mockedSurfboard.id, {
        name: faker.string.alpha(),
      });

      expect(mockedSurfboardModel.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deleteCountry', () => {
    it('should return 422 when country does not exist', async () => {
      mockedCountryModel.destroy.mockResolvedValue(0);

      let err: UnprocessableEntityException;

      try {
        await service.deleteCountry(faker.string.uuid());
      } catch (error) {
        err = error;
      }

      expect(mockedCountryModel.destroy).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      mockedCountryModel.destroy.mockResolvedValue(1);

      const { success } = await service.deleteCountry(mockedCountry.id);

      expect(mockedCountryModel.destroy).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deleteSurfboard', () => {
    it('should return 422 when surfboard does not exist', async () => {
      mockedSurfboardModel.destroy.mockResolvedValue(0);

      let err: UnprocessableEntityException;

      try {
        await service.deleteSurfboard(faker.string.uuid());
      } catch (error) {
        err = error;
      }

      expect(mockedSurfboardModel.destroy).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      mockedSurfboardModel.destroy.mockResolvedValue(1);

      const { success } = await service.deleteSurfboard(mockedSurfboard.id);

      expect(mockedSurfboardModel.destroy).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
