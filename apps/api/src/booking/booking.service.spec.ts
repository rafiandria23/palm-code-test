import _ from 'lodash';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import { DATE_FORMAT } from '../common/constants/date.constant';
import {
  PaginationPage,
  PaginationSize,
  SortDirection,
} from '../common/constants/pagination.constant';
import { CommonService } from '../common/common.service';
import { SettingService } from '../setting/setting.service';

import { SurfingExperience } from './constants';
import { BookingSortProperty } from './constants/read.constant';
import { Booking } from './models/booking.model';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;

  const mockedBookingModel = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  };

  const mockedCommonService = {
    successTimestamp: jest.fn(),
    getFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  const mockedSettingService = {
    readCountryById: jest.fn(),
    readSurfboardById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getModelToken(Booking),
          useValue: mockedBookingModel,
        },
        // ConfigService,
        {
          provide: CommonService,
          useValue: mockedCommonService,
        },
        {
          provide: SettingService,
          useValue: mockedSettingService,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
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

  const mockedBooking = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    country_id: mockedCountry.id,
    surfing_experience: faker.number.int({
      min: SurfingExperience.MIN,
      max: SurfingExperience.MAX,
    }),
    date: dayjs(faker.date.future()).format(DATE_FORMAT),
    surfboard_id: mockedSurfboard.id,
    national_id_photo_file_key: faker.string.alphanumeric(),
  };

  describe('create', () => {});

  describe('readAll', () => {
    it('should return bookings without filters', async () => {
      const expectedResult = [
        {
          ...mockedBooking,
          country: mockedCountry,
          surfboard: mockedSurfboard,
        },
      ];

      mockedBookingModel.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: expectedResult,
      });

      const { success, data } = await service.readAll({
        page: PaginationPage.MIN,
        page_size: PaginationSize.MAX,
        sort: SortDirection.ASC,
        sort_by: BookingSortProperty.ID,
      });

      expect(mockedBookingModel.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult);
    });

    it('should return bookings with filters', async () => {
      const expectedResult = [
        {
          ...mockedBooking,
          country: mockedCountry,
          surfboard: mockedSurfboard,
        },
      ];

      mockedBookingModel.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: expectedResult,
      });

      const { success, data } = await service.readAll({
        page: PaginationPage.MIN,
        page_size: PaginationSize.MAX,
        sort: SortDirection.ASC,
        sort_by: BookingSortProperty.ID,
        name: mockedBooking.name,
      });

      expect(mockedBookingModel.findAndCountAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult);
    });
  });

  describe('readById', () => {
    it('should return booking', async () => {
      const expectedResult = {
        ...mockedBooking,
        country: mockedCountry,
        surfboard: mockedSurfboard,
      };

      mockedBookingModel.findByPk.mockResolvedValue(expectedResult);

      const result = await service.readById(mockedBooking.id);

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should return 422 when booking does not exist', async () => {
      mockedBookingModel.findByPk.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.update(faker.string.uuid(), {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: mockedCountry.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.MIN,
            max: SurfingExperience.MAX,
          }),
          date: dayjs(faker.date.future()).format(DATE_FORMAT),
          surfboard_id: mockedSurfboard.id,
          national_id_photo_file_key: faker.string.alphanumeric(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when country does not exist', async () => {
      mockedBookingModel.findByPk.mockResolvedValue(mockedBooking);
      mockedSettingService.readCountryById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.update(mockedBooking.id, {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: mockedCountry.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.MIN,
            max: SurfingExperience.MAX,
          }),
          date: dayjs(faker.date.future()).format(DATE_FORMAT),
          surfboard_id: mockedSurfboard.id,
          national_id_photo_file_key: faker.string.alphanumeric(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when surfboard does not exist', async () => {
      mockedBookingModel.findByPk.mockResolvedValue(mockedBooking);
      mockedSettingService.readCountryById.mockResolvedValue(mockedCountry);
      mockedSettingService.readSurfboardById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.update(mockedBooking.id, {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: mockedCountry.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.MIN,
            max: SurfingExperience.MAX,
          }),
          date: dayjs(faker.date.future()).format(DATE_FORMAT),
          surfboard_id: mockedSurfboard.id,
          national_id_photo_file_key: faker.string.alphanumeric(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {});
  });

  describe('delete', () => {
    it('should return 422 when booking does not exist', async () => {
      mockedBookingModel.findByPk.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.delete(faker.string.uuid());
      } catch (error) {
        err = error;
      }

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      const localMockedBooking = {
        ...mockedBooking,
        destroy: jest.fn(),
      };

      mockedBookingModel.findByPk.mockResolvedValue(localMockedBooking);
      mockedCommonService.deleteFile.mockResolvedValue(undefined);
      localMockedBooking.destroy.mockResolvedValue(undefined);
      mockedCommonService.successTimestamp.mockReturnValue({
        success: true,
      });

      const { success } = await service.delete(faker.string.uuid());

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);
      expect(mockedCommonService.deleteFile).toHaveBeenCalledTimes(1);
      expect(localMockedBooking.destroy).toHaveBeenCalledTimes(1);
      expect(mockedCommonService.successTimestamp).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
