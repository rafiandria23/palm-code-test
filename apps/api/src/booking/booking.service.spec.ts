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

  const mockedBookingModel = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  };

  const mockedFileService = {
    get: jest.fn(),
    getUrl: jest.fn(),
    delete: jest.fn(),
  };

  const mockedSettingService = {
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
          useValue: mockedFileService,
        },
        {
          provide: getModelToken(Booking),
          useValue: mockedBookingModel,
        },
        BookingService,
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

  const mockedNationalIdPhotoFile = {
    Body: faker.string.alpha(),
  };

  const mockedBooking = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    country_id: mockedCountry.id,
    surfing_experience: faker.number.int({
      min: SurfingExperience.Min,
      max: SurfingExperience.Max,
    }),
    date: dayjs(faker.date.future()).format(DATE_FORMAT),
    surfboard_id: mockedSurfboard.id,
    national_id_photo_file_key: faker.string.alphanumeric(),
  };

  describe('create', () => {
    it('should return 422 when country does not exist', async () => {
      mockedSettingService.readCountryById.mockResolvedValue(null);
      mockedSettingService.readSurfboardById.mockResolvedValue(mockedSurfboard);
      mockedFileService.get.mockResolvedValue(mockedNationalIdPhotoFile);

      let err: UnprocessableEntityException;

      try {
        await service.create(_.omit(mockedBooking, ['id']));
      } catch (error) {
        err = error;
      }

      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(mockedFileService.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when surfboard does not exist', async () => {
      mockedSettingService.readCountryById.mockResolvedValue(mockedCountry);
      mockedSettingService.readSurfboardById.mockResolvedValue(null);
      mockedFileService.get.mockResolvedValue(mockedNationalIdPhotoFile);

      let err: UnprocessableEntityException;

      try {
        await service.create(_.omit(mockedBooking, ['id']));
      } catch (error) {
        err = error;
      }

      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(mockedFileService.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when national ID photo file key is invalid', async () => {
      mockedSettingService.readCountryById.mockResolvedValue(mockedCountry);
      mockedSettingService.readSurfboardById.mockResolvedValue(mockedSurfboard);
      mockedFileService.get.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.create(_.omit(mockedBooking, ['id']));
      } catch (error) {
        err = error;
      }

      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(mockedFileService.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return created booking', async () => {
      const expectedResult = {
        ..._.omit(mockedBooking, ['national_id_photo_file_key']),
        national_id_photo_url: faker.internet.url(),
        country: mockedCountry,
        surfboard: mockedSurfboard,
      };

      mockedSettingService.readCountryById.mockResolvedValue({
        ...mockedCountry,
        toJSON: jest.fn().mockReturnValue(mockedCountry),
      });
      mockedSettingService.readSurfboardById.mockResolvedValue({
        ...mockedSurfboard,
        toJSON: jest.fn().mockReturnValue(mockedSurfboard),
      });
      mockedFileService.get.mockResolvedValue(mockedNationalIdPhotoFile);
      mockedBookingModel.create.mockResolvedValue({
        ...mockedBooking,
        toJSON: jest.fn().mockReturnValue(mockedBooking),
      });
      mockedBookingModel.create.mockResolvedValue({
        ...mockedBooking,
        toJSON: jest.fn().mockReturnValue(mockedBooking),
      });
      mockedFileService.getUrl.mockReturnValue(
        expectedResult.national_id_photo_url,
      );

      const { success, data } = await service.create(
        _.omit(mockedBooking, ['id']),
      );

      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(mockedFileService.get).toHaveBeenCalledTimes(1);
      expect(mockedBookingModel.create).toHaveBeenCalledTimes(1);
      expect(mockedFileService.getUrl).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult);
    });
  });

  describe('readAll', () => {
    it('should return bookings without filters', async () => {
      const expectedResult = [
        {
          ..._.omit(mockedBooking, ['national_id_photo_file_key']),
          national_id_photo_url: faker.internet.url(),
          country: mockedCountry,
          surfboard: mockedSurfboard,
        },
      ];

      mockedBookingModel.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [
          {
            ...mockedBooking,
            toJSON: jest.fn().mockReturnValue(mockedBooking),
          },
        ],
      });
      mockedSettingService.readCountryById.mockResolvedValue({
        ...mockedCountry,
        toJSON: jest.fn().mockReturnValue(mockedCountry),
      });
      mockedSettingService.readSurfboardById.mockResolvedValue({
        ...mockedSurfboard,
        toJSON: jest.fn().mockReturnValue(mockedSurfboard),
      });
      mockedFileService.getUrl.mockReturnValue(
        expectedResult[0].national_id_photo_url,
      );

      const { success, data } = await service.readAll({
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: BookingSortProperty.Id,
      });

      expect(mockedBookingModel.findAndCountAll).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(
        expectedResult.length,
      );
      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(
        expectedResult.length,
      );
      expect(mockedFileService.getUrl).toHaveBeenCalledTimes(
        expectedResult.length,
      );

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult);
    });

    it('should return bookings with filters', async () => {
      const expectedResult = [
        {
          ..._.omit(mockedBooking, ['national_id_photo_file_key']),
          national_id_photo_url: faker.internet.url(),
          country: mockedCountry,
          surfboard: mockedSurfboard,
        },
      ];

      mockedBookingModel.findAndCountAll.mockResolvedValue({
        count: faker.number.int(),
        rows: [
          {
            ...mockedBooking,
            toJSON: jest.fn().mockReturnValue(mockedBooking),
          },
        ],
      });
      mockedSettingService.readCountryById.mockResolvedValue({
        ...mockedCountry,
        toJSON: jest.fn().mockReturnValue(mockedCountry),
      });
      mockedSettingService.readSurfboardById.mockResolvedValue({
        ...mockedSurfboard,
        toJSON: jest.fn().mockReturnValue(mockedSurfboard),
      });
      mockedFileService.getUrl.mockReturnValue(
        expectedResult[0].national_id_photo_url,
      );

      const { success, data } = await service.readAll({
        page: PaginationPage.Min,
        page_size: PaginationSize.Max,
        sort: SortDirection.Asc,
        sort_by: BookingSortProperty.Id,
        name: mockedBooking.name,
      });

      expect(mockedBookingModel.findAndCountAll).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(
        expectedResult.length,
      );
      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(
        expectedResult.length,
      );
      expect(mockedFileService.getUrl).toHaveBeenCalledTimes(
        expectedResult.length,
      );

      expect(success).toBeTruthy();
      expect(data).toEqual(expectedResult);
    });
  });

  describe('readById', () => {
    it('should return null when booking does not exist', async () => {
      mockedBookingModel.findByPk.mockResolvedValue(null);

      const result = await service.readById(faker.string.uuid());

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);

      expect(result).toBeNull();
    });

    it('should return booking', async () => {
      const expectedResult = {
        ..._.omit(mockedBooking, ['national_id_photo_file_key']),
        national_id_photo_url: faker.internet.url(),
        country: mockedCountry,
        surfboard: mockedSurfboard,
      };

      mockedBookingModel.findByPk.mockResolvedValue({
        ...mockedBooking,
        toJSON: jest.fn().mockReturnValue(mockedBooking),
      });
      mockedSettingService.readCountryById.mockResolvedValue({
        ...mockedCountry,
        toJSON: jest.fn().mockReturnValue(mockedCountry),
      });
      mockedSettingService.readSurfboardById.mockResolvedValue({
        ...mockedSurfboard,
        toJSON: jest.fn().mockReturnValue(mockedSurfboard),
      });
      mockedFileService.getUrl.mockReturnValue(
        expectedResult.national_id_photo_url,
      );

      const result = await service.readById(mockedBooking.id);

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(mockedFileService.getUrl).toHaveBeenCalledTimes(1);

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
            min: SurfingExperience.Min,
            max: SurfingExperience.Max,
          }),
          date: dayjs(faker.date.future()).format(DATE_FORMAT),
          surfboard_id: mockedSurfboard.id,
          national_id_photo_file_key: faker.string.alphanumeric(),
        });
      } catch (error) {
        err = error;
      }

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when country does not exist', async () => {
      mockedBookingModel.findByPk.mockResolvedValue(mockedBooking);
      mockedSettingService.readCountryById.mockResolvedValue(null);
      mockedSettingService.readSurfboardById.mockResolvedValue(mockedSurfboard);
      mockedFileService.get.mockResolvedValue(mockedNationalIdPhotoFile);

      let err: UnprocessableEntityException;

      try {
        await service.update(mockedBooking.id, {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: mockedCountry.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.Min,
            max: SurfingExperience.Max,
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
      expect(mockedFileService.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when surfboard does not exist', async () => {
      mockedBookingModel.findByPk.mockResolvedValue(mockedBooking);
      mockedSettingService.readCountryById.mockResolvedValue(mockedCountry);
      mockedSettingService.readSurfboardById.mockResolvedValue(null);
      mockedFileService.get.mockResolvedValue(mockedNationalIdPhotoFile);

      let err: UnprocessableEntityException;

      try {
        await service.update(mockedBooking.id, {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: mockedCountry.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.Min,
            max: SurfingExperience.Max,
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
      expect(mockedFileService.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return 422 when national ID photo file key is invalid', async () => {
      mockedBookingModel.findByPk.mockResolvedValue(mockedBooking);
      mockedSettingService.readCountryById.mockResolvedValue(mockedCountry);
      mockedSettingService.readSurfboardById.mockResolvedValue(mockedSurfboard);
      mockedFileService.get.mockResolvedValue(null);

      let err: UnprocessableEntityException;

      try {
        await service.update(mockedBooking.id, {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          country_id: mockedCountry.id,
          surfing_experience: faker.number.int({
            min: SurfingExperience.Min,
            max: SurfingExperience.Max,
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
      expect(mockedFileService.get).toHaveBeenCalledTimes(1);

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success when national ID photo file is new', async () => {
      const localMockedBooking = {
        ...mockedBooking,
        update: jest.fn().mockResolvedValue(undefined),
      };

      mockedBookingModel.findByPk.mockResolvedValue(localMockedBooking);
      mockedSettingService.readCountryById.mockResolvedValue(mockedCountry);
      mockedSettingService.readSurfboardById.mockResolvedValue(mockedSurfboard);
      mockedFileService.get.mockResolvedValue(mockedNationalIdPhotoFile);
      mockedFileService.delete.mockResolvedValue(undefined);

      const { success } = await service.update(mockedBooking.id, {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        country_id: mockedCountry.id,
        surfing_experience: faker.number.int({
          min: SurfingExperience.Min,
          max: SurfingExperience.Max,
        }),
        date: dayjs(faker.date.future()).format(DATE_FORMAT),
        surfboard_id: mockedSurfboard.id,
        national_id_photo_file_key: faker.string.alphanumeric(),
      });

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(mockedFileService.get).toHaveBeenCalledTimes(1);
      expect(mockedFileService.delete).toHaveBeenCalledTimes(1);
      expect(localMockedBooking.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });

    it('should return success when national ID photo file is new and deletion of existing national ID photo fails', async () => {
      const localMockedBooking = {
        ...mockedBooking,
        update: jest.fn().mockResolvedValue(undefined),
      };

      mockedBookingModel.findByPk.mockResolvedValue(localMockedBooking);
      mockedSettingService.readCountryById.mockResolvedValue(mockedCountry);
      mockedSettingService.readSurfboardById.mockResolvedValue(mockedSurfboard);
      mockedFileService.get.mockResolvedValue(mockedNationalIdPhotoFile);
      mockedFileService.delete.mockRejectedValue(new Error());

      const { success } = await service.update(mockedBooking.id, {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        country_id: mockedCountry.id,
        surfing_experience: faker.number.int({
          min: SurfingExperience.Min,
          max: SurfingExperience.Max,
        }),
        date: dayjs(faker.date.future()).format(DATE_FORMAT),
        surfboard_id: mockedSurfboard.id,
        national_id_photo_file_key: faker.string.alphanumeric(),
      });

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(mockedFileService.get).toHaveBeenCalledTimes(1);
      expect(mockedFileService.delete).toHaveBeenCalledTimes(1);
      expect(localMockedBooking.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });

    it('should return success', async () => {
      const localMockedBooking = {
        ...mockedBooking,
        update: jest.fn().mockResolvedValue(undefined),
      };

      mockedBookingModel.findByPk.mockResolvedValue(localMockedBooking);
      mockedSettingService.readCountryById.mockResolvedValue(mockedCountry);
      mockedSettingService.readSurfboardById.mockResolvedValue(mockedSurfboard);
      mockedFileService.get.mockResolvedValue(mockedNationalIdPhotoFile);

      const { success } = await service.update(mockedBooking.id, {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        country_id: mockedCountry.id,
        surfing_experience: faker.number.int({
          min: SurfingExperience.Min,
          max: SurfingExperience.Max,
        }),
        date: dayjs(faker.date.future()).format(DATE_FORMAT),
        surfboard_id: mockedSurfboard.id,
        national_id_photo_file_key: mockedBooking.national_id_photo_file_key,
      });

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readCountryById).toHaveBeenCalledTimes(1);
      expect(mockedSettingService.readSurfboardById).toHaveBeenCalledTimes(1);
      expect(mockedFileService.get).toHaveBeenCalledTimes(1);
      expect(localMockedBooking.update).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
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

      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.getStatus()).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return success', async () => {
      const localMockedBooking = {
        ...mockedBooking,
        destroy: jest.fn(),
      };

      mockedBookingModel.findByPk.mockResolvedValue(localMockedBooking);
      mockedFileService.delete.mockResolvedValue(undefined);
      localMockedBooking.destroy.mockResolvedValue(undefined);

      const { success } = await service.delete(faker.string.uuid());

      expect(mockedBookingModel.findByPk).toHaveBeenCalledTimes(1);
      expect(mockedFileService.delete).toHaveBeenCalledTimes(1);
      expect(localMockedBooking.destroy).toHaveBeenCalledTimes(1);

      expect(success).toBeTruthy();
    });
  });
});
