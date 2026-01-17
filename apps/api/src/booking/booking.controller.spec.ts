import _ from 'lodash';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import {
  DATE_FORMAT,
  PaginationPage,
  PaginationSize,
  SortDirection,
} from '../common/common.constant';
import { DbTransactionInterceptor } from '../common/common.interceptor';
import { CommonService } from '../common/common.service';
import { FileService } from '../file/file.service';

import { SurfingExperience, BookingSortProperty } from './booking.constant';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

describe('BookingController', () => {
  let fileService: FileService;

  let controller: BookingController;

  const dbTransactionMock: SequelizeTransaction = {} as SequelizeTransaction;

  const bookingServiceMock = {
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
        FileService,
        {
          provide: BookingService,
          useValue: bookingServiceMock,
        },
      ],
    })
      .overrideInterceptor(DbTransactionInterceptor)
      .useValue(dbTransactionMock)
      .compile();

    fileService = module.get<FileService>(FileService);

    controller = module.get<BookingController>(BookingController);
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

  const bookingMock = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    country_id: countryMock.id,
    surfing_experience: faker.number.int({
      min: SurfingExperience.Min,
      max: SurfingExperience.Max,
    }),
    date: dayjs().format(DATE_FORMAT),
    surfboard_id: surfboardMock.id,
    national_id_photo_file_key: `${faker.string.uuid()}.${faker.system.fileExt()}`,
  };

  describe('create', () => {
    it('should return created booking', async () => {
      const expectedResult = {
        success: true,
        data: {
          ..._.omit(bookingMock, ['national_id_photo_file_key']),
          national_id_photo_url: fileService.getUrl(
            bookingMock.national_id_photo_file_key,
          ),

          country: countryMock,
          surfboard: surfboardMock,
        },
      };

      bookingServiceMock.create.mockResolvedValue(expectedResult);

      const { success, data } = await controller.create(
        dbTransactionMock,
        _.omit(bookingMock, ['id']),
      );

      expect(bookingServiceMock.create).toHaveBeenCalledTimes(1);

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
            ..._.omit(bookingMock, ['national_id_photo_file_key']),
            national_id_photo_url: fileService.getUrl(
              bookingMock.national_id_photo_file_key,
            ),

            country: countryMock,
            surfboard: surfboardMock,
          },
        ],
      };

      bookingServiceMock.readAll.mockResolvedValue(expectedResult);

      const { success, data } = await controller.readAll(dbTransactionMock, {
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: BookingSortProperty.Id,
        name: bookingMock.name,
      });

      expect(bookingServiceMock.readAll).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult.data);
    });
  });

  describe('readById', () => {
    it('should return 422 when booking does not exist', async () => {
      bookingServiceMock.readById.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await controller.readById(dbTransactionMock, {
          id: faker.string.uuid(),
        });
      } catch (error) {
        err = error;
      }

      expect(bookingServiceMock.readById).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return booking', async () => {
      const expectedResult = {
        ..._.omit(bookingMock, ['national_id_photo_file_key']),
        national_id_photo_url: fileService.getUrl(
          bookingMock.national_id_photo_file_key,
        ),

        country: countryMock,
        surfboard: surfboardMock,
      };

      bookingServiceMock.readById.mockResolvedValue(expectedResult);

      const { success, data } = await controller.readById(
        dbTransactionMock,
        _.pick(bookingMock, ['id']),
      );

      expect(bookingServiceMock.readById).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should return success', async () => {
      bookingServiceMock.update.mockResolvedValue({ success: true });

      const { success } = await controller.update(
        dbTransactionMock,
        _.pick(bookingMock, ['id']),
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: countryMock.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.Min,
            max: SurfingExperience.Max,
          }),
          date: dayjs().format(DATE_FORMAT),
          surfboard_id: surfboardMock.id,
          national_id_photo_file_key: `${faker.string.uuid()}.${faker.system.fileExt()}`,
        },
      );

      expect(bookingServiceMock.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should return success', async () => {
      bookingServiceMock.delete.mockResolvedValue({ success: true });

      const { success } = await controller.delete(
        dbTransactionMock,
        _.pick(bookingMock, ['id']),
      );

      expect(bookingServiceMock.delete).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
