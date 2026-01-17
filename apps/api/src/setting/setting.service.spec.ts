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

import { CountrySortProperty, SurfboardSortProperty } from './setting.constant';
import { Country } from './models/country.model';
import { Surfboard } from './models/surfboard.model';
import { SettingService } from './setting.service';

describe('SettingService', () => {
  let service: SettingService;

  const countryModelMock = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const surfboardModelMock = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CommonService,
        {
          provide: getModelToken(Country),
          useValue: countryModelMock,
        },
        {
          provide: getModelToken(Surfboard),
          useValue: surfboardModelMock,
        },
        SettingService,
      ],
    }).compile();

    service = module.get<SettingService>(SettingService);
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
      countryModelMock.create.mockResolvedValue(countryMock);

      const { success, data } = await service.createCountry(
        _.omit(countryMock, ['id']),
      );

      expect(countryModelMock.create).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(countryMock);
    });
  });

  describe('createSurfboard', () => {
    it('should return created surfboard', async () => {
      surfboardModelMock.create.mockResolvedValue(surfboardMock);

      const { success, data } = await service.createSurfboard(
        _.omit(surfboardMock, ['id']),
      );

      expect(surfboardModelMock.create).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(surfboardMock);
    });
  });

  describe('readAllCountries', () => {
    it('should return countries without filters', async () => {
      countryModelMock.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [countryMock],
      });

      const { success, data } = await service.readAllCountries({
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: CountrySortProperty.Id,
      });

      expect(countryModelMock.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([countryMock]);
    });

    it('should return countries with filters', async () => {
      countryModelMock.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [countryMock],
      });

      const { success, data } = await service.readAllCountries({
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: CountrySortProperty.Id,
        name: countryMock.name,
      });

      expect(countryModelMock.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([countryMock]);
    });
  });

  describe('readCountryById', () => {
    it('should return country', async () => {
      countryModelMock.findByPk.mockResolvedValue(countryMock);

      const result = await service.readCountryById(countryMock.id);

      expect(countryModelMock.findByPk).toHaveBeenCalledTimes(1);

      expect(result).toEqual(countryMock);
    });
  });

  describe('readAllSurfboards', () => {
    it('should return surfboards without filters', async () => {
      surfboardModelMock.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [surfboardMock],
      });

      const { success, data } = await service.readAllSurfboards({
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: SurfboardSortProperty.Id,
      });

      expect(surfboardModelMock.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([surfboardMock]);
    });

    it('should return surfboards with filters', async () => {
      surfboardModelMock.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [surfboardMock],
      });

      const { success, data } = await service.readAllSurfboards({
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: SurfboardSortProperty.Id,
        name: surfboardMock.name,
      });

      expect(surfboardModelMock.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual([surfboardMock]);
    });
  });

  describe('readSurfboardById', () => {
    it('should return country', async () => {
      surfboardModelMock.findByPk.mockResolvedValue(surfboardMock);

      const result = await service.readSurfboardById(surfboardMock.id);

      expect(surfboardModelMock.findByPk).toHaveBeenCalledTimes(1);

      expect(result).toEqual(surfboardMock);
    });
  });

  describe('updateCountry', () => {
    it('should return 422 when country does not exist', async () => {
      countryModelMock.update.mockResolvedValue([0]);

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

      expect(countryModelMock.update).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      countryModelMock.update.mockResolvedValue([1]);

      const { success } = await service.updateCountry(countryMock.id, {
        name: faker.string.alpha(),
        code: faker.string.alphanumeric(),
        dial_code: faker.string.alphanumeric(),
        emoji: faker.string.alphanumeric(),
      });

      expect(countryModelMock.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('updateSurfboard', () => {
    it('should return 422 when surfboard does not exist', async () => {
      surfboardModelMock.update.mockResolvedValue([0]);

      let err: UnprocessableEntityException;

      try {
        await service.updateSurfboard(faker.string.uuid(), {
          name: faker.string.alpha(),
        });
      } catch (error) {
        err = error;
      }

      expect(surfboardModelMock.update).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      surfboardModelMock.update.mockResolvedValue([1]);

      const { success } = await service.updateSurfboard(surfboardMock.id, {
        name: faker.string.alpha(),
      });

      expect(surfboardModelMock.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deleteCountry', () => {
    it('should return 422 when country does not exist', async () => {
      countryModelMock.destroy.mockResolvedValue(0);

      let err: UnprocessableEntityException;

      try {
        await service.deleteCountry(faker.string.uuid());
      } catch (error) {
        err = error;
      }

      expect(countryModelMock.destroy).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      countryModelMock.destroy.mockResolvedValue(1);

      const { success } = await service.deleteCountry(countryMock.id);

      expect(countryModelMock.destroy).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('deleteSurfboard', () => {
    it('should return 422 when surfboard does not exist', async () => {
      surfboardModelMock.destroy.mockResolvedValue(0);

      let err: UnprocessableEntityException;

      try {
        await service.deleteSurfboard(faker.string.uuid());
      } catch (error) {
        err = error;
      }

      expect(surfboardModelMock.destroy).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      surfboardModelMock.destroy.mockResolvedValue(1);

      const { success } = await service.deleteSurfboard(surfboardMock.id);

      expect(surfboardModelMock.destroy).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
