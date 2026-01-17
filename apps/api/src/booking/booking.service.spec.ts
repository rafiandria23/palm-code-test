import _ from 'lodash';
import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/sequelize';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import {
  DATE_FORMAT,
  PaginationPage,
  PaginationSize,
  SortDirection,
} from '../common/common.constant';
import { CommonService } from '../common/common.service';
import { FileService } from '../file/file.service';
import { SettingService } from '../setting/setting.service';

import { SurfingExperience, BookingSortProperty } from './booking.constant';
import { Booking } from './models/booking.model';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;

  const bookingModelMock = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  };

  const fileServiceMock = {
    get: jest.fn(),
    getUrl: jest.fn(),
    delete: jest.fn(),
  };

  const settingServiceMock = {
    readCountryById: jest.fn(),
    readSurfboardById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CommonService,
        {
          provide: FileService,
          useValue: fileServiceMock,
        },
        {
          provide: getModelToken(Booking),
          useValue: bookingModelMock,
        },
        BookingService,
        {
          provide: SettingService,
          useValue: settingServiceMock,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
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

  const nationalIdPhotoFileMock = {
    Body: faker.string.alpha(),
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
    date: dayjs(faker.date.future()).format(DATE_FORMAT),
    surfboard_id: surfboardMock.id,
    national_id_photo_file_key: faker.string.alphanumeric(),
  };

  describe('create', () => {
    it('should return 422 when country does not exist', async () => {
      settingServiceMock.readCountryById.mockResolvedValue(null);
      settingServiceMock.readSurfboardById.mockResolvedValue(surfboardMock);
      fileServiceMock.get.mockResolvedValue(nationalIdPhotoFileMock);

      let err: UnprocessableEntityException;

      try {
        await service.create(_.omit(bookingMock, ['id']));
      } catch (error) {
        err = error;
      }

      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when surfboard does not exist', async () => {
      settingServiceMock.readCountryById.mockResolvedValue(countryMock);
      settingServiceMock.readSurfboardById.mockResolvedValue(null);
      fileServiceMock.get.mockResolvedValue(nationalIdPhotoFileMock);

      let err: UnprocessableEntityException;

      try {
        await service.create(_.omit(bookingMock, ['id']));
      } catch (error) {
        err = error;
      }

      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when national ID photo file key is invalid', async () => {
      settingServiceMock.readCountryById.mockResolvedValue(countryMock);
      settingServiceMock.readSurfboardById.mockResolvedValue(surfboardMock);
      fileServiceMock.get.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.create(_.omit(bookingMock, ['id']));
      } catch (error) {
        err = error;
      }

      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return created booking', async () => {
      const expectedResult = {
        ..._.omit(bookingMock, ['national_id_photo_file_key']),
        national_id_photo_url: faker.internet.url(),
        country: countryMock,
        surfboard: surfboardMock,
      };

      settingServiceMock.readCountryById.mockResolvedValue({
        ...countryMock,
        toJSON: jest.fn().mockReturnValue(countryMock),
      });
      settingServiceMock.readSurfboardById.mockResolvedValue({
        ...surfboardMock,
        toJSON: jest.fn().mockReturnValue(surfboardMock),
      });
      fileServiceMock.get.mockResolvedValue(nationalIdPhotoFileMock);
      bookingModelMock.create.mockResolvedValue({
        ...bookingMock,
        toJSON: jest.fn().mockReturnValue(bookingMock),
      });
      bookingModelMock.create.mockResolvedValue({
        ...bookingMock,
        toJSON: jest.fn().mockReturnValue(bookingMock),
      });
      fileServiceMock.getUrl.mockReturnValue(
        expectedResult.national_id_photo_url,
      );

      const { success, data } = await service.create(
        _.omit(bookingMock, ['id']),
      );

      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.get).toHaveBeenCalledTimes(1);
      expect(bookingModelMock.create).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.getUrl).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult);
    });
  });

  describe('readAll', () => {
    it('should return bookings without filters', async () => {
      const expectedResult = [
        {
          ..._.omit(bookingMock, ['national_id_photo_file_key']),
          national_id_photo_url: faker.internet.url(),
          country: countryMock,
          surfboard: surfboardMock,
        },
      ];

      bookingModelMock.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [
          {
            ...bookingMock,
            toJSON: jest.fn().mockReturnValue(bookingMock),
          },
        ],
      });
      settingServiceMock.readCountryById.mockResolvedValue({
        ...countryMock,
        toJSON: jest.fn().mockReturnValue(countryMock),
      });
      settingServiceMock.readSurfboardById.mockResolvedValue({
        ...surfboardMock,
        toJSON: jest.fn().mockReturnValue(surfboardMock),
      });
      fileServiceMock.getUrl.mockReturnValue(
        expectedResult[0].national_id_photo_url,
      );

      const { success, data } = await service.readAll({
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: BookingSortProperty.Id,
      });

      expect(bookingModelMock.findAndCountAll).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(
        expectedResult.length,
      );
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(
        expectedResult.length,
      );
      expect(fileServiceMock.getUrl).toHaveBeenCalledTimes(
        expectedResult.length,
      );

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult);
    });

    it('should return bookings with filters', async () => {
      const expectedResult = [
        {
          ..._.omit(bookingMock, ['national_id_photo_file_key']),
          national_id_photo_url: faker.internet.url(),
          country: countryMock,
          surfboard: surfboardMock,
        },
      ];

      bookingModelMock.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [
          {
            ...bookingMock,
            toJSON: jest.fn().mockReturnValue(bookingMock),
          },
        ],
      });
      settingServiceMock.readCountryById.mockResolvedValue({
        ...countryMock,
        toJSON: jest.fn().mockReturnValue(countryMock),
      });
      settingServiceMock.readSurfboardById.mockResolvedValue({
        ...surfboardMock,
        toJSON: jest.fn().mockReturnValue(surfboardMock),
      });
      fileServiceMock.getUrl.mockReturnValue(
        expectedResult[0].national_id_photo_url,
      );

      const { success, data } = await service.readAll({
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: BookingSortProperty.Id,
        name: bookingMock.name,
      });

      expect(bookingModelMock.findAndCountAll).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(
        expectedResult.length,
      );
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(
        expectedResult.length,
      );
      expect(fileServiceMock.getUrl).toHaveBeenCalledTimes(
        expectedResult.length,
      );

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult);
    });
  });

  describe('readById', () => {
    it('should return null when booking does not exist', async () => {
      bookingModelMock.findByPk.mockResolvedValue(null);

      const result = await service.readById(faker.string.uuid());

      expect(bookingModelMock.findByPk).toHaveBeenCalledTimes(1);

      expect(result).toBeNull();
    });

    it('should return booking', async () => {
      const expectedResult = {
        ..._.omit(bookingMock, ['national_id_photo_file_key']),
        national_id_photo_url: faker.internet.url(),
        country: countryMock,
        surfboard: surfboardMock,
      };

      bookingModelMock.findByPk.mockResolvedValue({
        ...bookingMock,
        toJSON: jest.fn().mockReturnValue(bookingMock),
      });
      settingServiceMock.readCountryById.mockResolvedValue({
        ...countryMock,
        toJSON: jest.fn().mockReturnValue(countryMock),
      });
      settingServiceMock.readSurfboardById.mockResolvedValue({
        ...surfboardMock,
        toJSON: jest.fn().mockReturnValue(surfboardMock),
      });
      fileServiceMock.getUrl.mockReturnValue(
        expectedResult.national_id_photo_url,
      );

      const result = await service.readById(bookingMock.id);

      expect(bookingModelMock.findByPk).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.getUrl).toHaveBeenCalledTimes(1);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should return 422 when booking does not exist', async () => {
      bookingModelMock.findByPk.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.update(faker.string.uuid(), {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: countryMock.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.Min,
            max: SurfingExperience.Max,
          }),
          date: dayjs(faker.date.future()).format(DATE_FORMAT),
          surfboard_id: surfboardMock.id,
          national_id_photo_file_key: faker.string.alphanumeric(),
        });
      } catch (error) {
        err = error;
      }

      expect(bookingModelMock.findByPk).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when country does not exist', async () => {
      bookingModelMock.findByPk.mockResolvedValue(bookingMock);
      settingServiceMock.readCountryById.mockResolvedValue(null);
      settingServiceMock.readSurfboardById.mockResolvedValue(surfboardMock);
      fileServiceMock.get.mockResolvedValue(nationalIdPhotoFileMock);

      let err: UnprocessableEntityException;

      try {
        await service.update(bookingMock.id, {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: countryMock.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.Min,
            max: SurfingExperience.Max,
          }),
          date: dayjs(faker.date.future()).format(DATE_FORMAT),
          surfboard_id: surfboardMock.id,
          national_id_photo_file_key: faker.string.alphanumeric(),
        });
      } catch (error) {
        err = error;
      }

      expect(bookingModelMock.findByPk).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when surfboard does not exist', async () => {
      bookingModelMock.findByPk.mockResolvedValue(bookingMock);
      settingServiceMock.readCountryById.mockResolvedValue(countryMock);
      settingServiceMock.readSurfboardById.mockResolvedValue(null);
      fileServiceMock.get.mockResolvedValue(nationalIdPhotoFileMock);

      let err: UnprocessableEntityException;

      try {
        await service.update(bookingMock.id, {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: countryMock.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.Min,
            max: SurfingExperience.Max,
          }),
          date: dayjs(faker.date.future()).format(DATE_FORMAT),
          surfboard_id: surfboardMock.id,
          national_id_photo_file_key: faker.string.alphanumeric(),
        });
      } catch (error) {
        err = error;
      }

      expect(bookingModelMock.findByPk).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when national ID photo file key is invalid', async () => {
      bookingModelMock.findByPk.mockResolvedValue(bookingMock);
      settingServiceMock.readCountryById.mockResolvedValue(countryMock);
      settingServiceMock.readSurfboardById.mockResolvedValue(surfboardMock);
      fileServiceMock.get.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.update(bookingMock.id, {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: countryMock.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.Min,
            max: SurfingExperience.Max,
          }),
          date: dayjs(faker.date.future()).format(DATE_FORMAT),
          surfboard_id: surfboardMock.id,
          national_id_photo_file_key: faker.string.alphanumeric(),
        });
      } catch (error) {
        err = error;
      }

      expect(bookingModelMock.findByPk).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success when national ID photo file is new', async () => {
      const localBookingMock = {
        ...bookingMock,
        update: jest.fn().mockResolvedValue(undefined),
      };

      bookingModelMock.findByPk.mockResolvedValue(localBookingMock);
      settingServiceMock.readCountryById.mockResolvedValue(countryMock);
      settingServiceMock.readSurfboardById.mockResolvedValue(surfboardMock);
      fileServiceMock.get.mockResolvedValue(nationalIdPhotoFileMock);
      fileServiceMock.delete.mockResolvedValue(undefined);

      const { success } = await service.update(bookingMock.id, {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        country_id: countryMock.id,
        surfing_experience: faker.number.int({
          min: SurfingExperience.Min,
          max: SurfingExperience.Max,
        }),
        date: dayjs(faker.date.future()).format(DATE_FORMAT),
        surfboard_id: surfboardMock.id,
        national_id_photo_file_key: faker.string.alphanumeric(),
      });

      expect(bookingModelMock.findByPk).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.get).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.delete).toHaveBeenCalledTimes(1);
      expect(localBookingMock.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });

    it('should return success when national ID photo file is new and deletion of existing national ID photo fails', async () => {
      const localBookingMock = {
        ...bookingMock,
        update: jest.fn().mockResolvedValue(undefined),
      };

      bookingModelMock.findByPk.mockResolvedValue(localBookingMock);
      settingServiceMock.readCountryById.mockResolvedValue(countryMock);
      settingServiceMock.readSurfboardById.mockResolvedValue(surfboardMock);
      fileServiceMock.get.mockResolvedValue(nationalIdPhotoFileMock);
      fileServiceMock.delete.mockRejectedValue(new Error());

      const { success } = await service.update(bookingMock.id, {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        country_id: countryMock.id,
        surfing_experience: faker.number.int({
          min: SurfingExperience.Min,
          max: SurfingExperience.Max,
        }),
        date: dayjs(faker.date.future()).format(DATE_FORMAT),
        surfboard_id: surfboardMock.id,
        national_id_photo_file_key: faker.string.alphanumeric(),
      });

      expect(bookingModelMock.findByPk).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.get).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.delete).toHaveBeenCalledTimes(1);
      expect(localBookingMock.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });

    it('should return success', async () => {
      const localBookingMock = {
        ...bookingMock,
        update: jest.fn().mockResolvedValue(undefined),
      };

      bookingModelMock.findByPk.mockResolvedValue(localBookingMock);
      settingServiceMock.readCountryById.mockResolvedValue(countryMock);
      settingServiceMock.readSurfboardById.mockResolvedValue(surfboardMock);
      fileServiceMock.get.mockResolvedValue(nationalIdPhotoFileMock);

      const { success } = await service.update(bookingMock.id, {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        country_id: countryMock.id,
        surfing_experience: faker.number.int({
          min: SurfingExperience.Min,
          max: SurfingExperience.Max,
        }),
        date: dayjs(faker.date.future()).format(DATE_FORMAT),
        surfboard_id: surfboardMock.id,
        national_id_photo_file_key: bookingMock.national_id_photo_file_key,
      });

      expect(bookingModelMock.findByPk).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readCountryById).toHaveBeenCalledTimes(1);
      expect(settingServiceMock.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.get).toHaveBeenCalledTimes(1);
      expect(localBookingMock.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should return 422 when booking does not exist', async () => {
      bookingModelMock.findByPk.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.delete(faker.string.uuid());
      } catch (error) {
        err = error;
      }

      expect(bookingModelMock.findByPk).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      const localBookingMock = {
        ...bookingMock,
        destroy: jest.fn(),
      };

      bookingModelMock.findByPk.mockResolvedValue(localBookingMock);
      fileServiceMock.delete.mockResolvedValue(undefined);
      localBookingMock.destroy.mockResolvedValue(undefined);

      const { success } = await service.delete(faker.string.uuid());

      expect(bookingModelMock.findByPk).toHaveBeenCalledTimes(1);
      expect(fileServiceMock.delete).toHaveBeenCalledTimes(1);
      expect(localBookingMock.destroy).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
