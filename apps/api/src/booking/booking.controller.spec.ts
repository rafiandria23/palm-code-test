import _ from 'lodash';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import { DATE_FORMAT } from '../common/constants/date.constant';
import {
  PaginationPage,
  PaginationSize,
  SortDirection,
} from '../common/constants/pagination.constant';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { CommonService } from '../common/common.service';

import { SurfingExperience } from './constants';
import { BookingSortProperty } from './constants/read.constant';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

describe('BookingController', () => {
  let commonService: CommonService;

  let controller: BookingController;

  const mockedBookingService = {
    create: jest.fn(),
    readAll: jest.fn(),
    readById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        ConfigService,
        CommonService,
        {
          provide: BookingService,
          useValue: mockedBookingService,
        },
      ],
    })
      .overrideInterceptor(TransactionInterceptor)
      .useValue({})
      .compile();

    commonService = module.get<CommonService>(CommonService);

    controller = module.get<BookingController>(BookingController);
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
    date: dayjs().format(DATE_FORMAT),
    surfboard_id: mockedSurfboard.id,
    national_id_photo_file_key: `${faker.string.uuid()}.${faker.system.fileExt()}`,
  };

  describe('create', () => {
    it('should return created booking', async () => {
      const expectedResult = {
        success: true,
        data: {
          ..._.omit(mockedBooking, ['national_id_photo_file_key']),
          national_id_photo_url: commonService.getFileUrl(
            mockedBooking.national_id_photo_file_key,
          ),

          country: mockedCountry,
          surfboard: mockedSurfboard,
        },
      };

      mockedBookingService.create.mockResolvedValue(expectedResult);

      const { success, data } = await controller.create(
        _.omit(mockedBooking, ['id']),
      );

      expect(mockedBookingService.create).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult.data);
    });
  });

  describe('uploadNationalIdPhoto', () => {
    it('should return file key', async () => {
      const expectedResult = {
        success: true,
        data: {
          file_key: faker.string.alphanumeric(),
        },
      };

      const { success, data } = await controller.uploadNationalIdPhoto({
        key: expectedResult.data.file_key,
      });

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult.data);
    });
  });

  describe('readAll', () => {
    it('should return bookings', async () => {
      const expectedResult = {
        success: true,
        data: [
          {
            ..._.omit(mockedBooking, ['national_id_photo_file_key']),
            national_id_photo_url: commonService.getFileUrl(
              mockedBooking.national_id_photo_file_key,
            ),

            country: mockedCountry,
            surfboard: mockedSurfboard,
          },
        ],
      };

      mockedBookingService.readAll.mockResolvedValue(expectedResult);

      const { success, data } = await controller.readAll({
        page: PaginationPage.MIN,
        page_size: PaginationSize.MAX,
        sort: SortDirection.ASC,
        sort_by: BookingSortProperty.ID,
        name: mockedBooking.name,
      });

      expect(mockedBookingService.readAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult.data);
    });
  });

  describe('readById', () => {
    it('should return 422 when booking does not exist', async () => {
      mockedBookingService.readById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.readById({
          id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedBookingService.readById).toHaveBeenCalledTimes(1);

      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return booking', async () => {
      const expectedResult = {
        ..._.omit(mockedBooking, ['national_id_photo_file_key']),
        national_id_photo_url: commonService.getFileUrl(
          mockedBooking.national_id_photo_file_key,
        ),

        country: mockedCountry,
        surfboard: mockedSurfboard,
      };

      mockedBookingService.readById.mockResolvedValue(expectedResult);

      const { success, data } = await controller.readById(
        _.pick(mockedBooking, ['id']),
      );

      expect(mockedBookingService.readById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should return success', async () => {
      mockedBookingService.update.mockResolvedValue({ success: true });

      const { success } = await controller.update(
        _.pick(mockedBooking, ['id']),
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: mockedCountry.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.MIN,
            max: SurfingExperience.MAX,
          }),
          date: dayjs().format(DATE_FORMAT),
          surfboard_id: mockedSurfboard.id,
          national_id_photo_file_key: `${faker.string.uuid()}.${faker.system.fileExt()}`,
        },
      );

      expect(mockedBookingService.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should return success', async () => {
      mockedBookingService.delete.mockResolvedValue({ success: true });

      const { success } = await controller.delete(
        _.pick(mockedBooking, ['id']),
      );

      expect(mockedBookingService.delete).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
