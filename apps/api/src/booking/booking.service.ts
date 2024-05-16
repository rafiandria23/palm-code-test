import _ from 'lodash';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import {
  PaginationQueryDto,
  SortQueryDto,
} from '../common/dtos/pagination.dto';
import { CommonService } from '../common/common.service';
import { SettingService } from '../setting/setting.service';

import { Booking } from './models/booking.model';
import { CreateBookingBodyDto } from './dtos/create.dto';
import { ReadAllBookingsQueryDto } from './dtos/read.dto';
import { UpdateBookingBodyDto } from './dtos/update.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(Booking) private readonly bookingModel: typeof Booking,
    private readonly commonService: CommonService,
    private readonly settingService: SettingService,
  ) {}

  public async create(payload: CreateBookingBodyDto) {
    const [existingCountry, existingSurfboard] = await Promise.all([
      this.settingService.readCountryById(payload.country_id),
      this.settingService.readSurfboardById(payload.surfboard_id),
    ]);

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country does not exist!');
    }

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard does not exist!');
    }

    const createdBooking = await this.bookingModel.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      country_id: existingCountry.id,
      surfing_experience: payload.surfing_experience,
      date: payload.date,
      surfboard_id: existingSurfboard.id,
      national_id_photo_file_key: payload.national_id_photo_file_key,
    });

    const result = createdBooking.toJSON();

    _.set(
      result,
      'national_id_photo_url',
      this.commonService.getFileUrl(result.national_id_photo_file_key),
    );
    _.set(result, 'country', existingCountry);
    _.set(result, 'surfboard', existingSurfboard);

    return this.commonService.successTimestamp({
      data: result,
    });
  }

  public async readAll(queries: ReadAllBookingsQueryDto) {
    return await this.sequelize.transaction(async (transaction) => {
      const options: Omit<FindAndCountOptions<Booking>, 'group'> = {
        where: {},
        offset: queries.page_size * (queries.page - 1),
        limit: queries.page_size,
        order: [[queries.sort_by, queries.sort]],
        transaction,
      };

      const filters = _.omit(queries, [
        ..._.keys(new PaginationQueryDto()),
        ..._.keys(new SortQueryDto()),
        'sort_by',
      ]);

      if (!_.isEmpty(filters)) {
        _.forOwn(filters, (filterValue, filterKey) => {
          options.where[filterKey] = {
            [Op.iLike]: `%${filterValue}%`,
          };
        });
      }

      const { count: total, rows: existingBookings } =
        await this.bookingModel.findAndCountAll(options);

      const result = [];

      for (const existingBooking of existingBookings.map((existingBooking) =>
        existingBooking.toJSON(),
      )) {
        const [existingCountry, existingSurfboard] = await Promise.all([
          this.settingService.readCountryById(existingBooking.country_id, {
            transaction,
          }),
          this.settingService.readSurfboardById(existingBooking.surfboard_id, {
            transaction,
          }),
        ]);

        _.set(existingBooking, 'country', existingCountry);
        _.set(existingBooking, 'surfboard', existingSurfboard);

        result.push(existingBooking);
      }

      return this.commonService.successTimestamp({
        metadata: {
          total,
        },
        data: result,
      });
    });
  }

  public async readById(id: string) {
    const existingBooking = await this.bookingModel.findByPk(id);

    if (!existingBooking) {
      return existingBooking;
    }

    const [existingCountry, existingSurfboard] = await Promise.all([
      this.settingService.readCountryById(existingBooking.country_id),
      this.settingService.readSurfboardById(existingBooking.surfboard_id),
    ]);

    const result = existingBooking.toJSON();

    _.set(
      result,
      'national_id_photo_url',
      this.commonService.getFileUrl(result.national_id_photo_file_key),
    );
    _.set(result, 'country', existingCountry);
    _.set(result, 'surfboard', existingSurfboard);

    return _.omit(result, ['national_id_photo_file_key']);
  }

  public async update(id: string, payload: UpdateBookingBodyDto) {
    const [existingCountry, existingSurfboard] = await Promise.all([
      this.settingService.readCountryById(payload.country_id),
      this.settingService.readSurfboardById(payload.surfboard_id),
    ]);

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country does not exist!');
    }

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard does not exist!');
    }

    const existingBooking = await this.bookingModel.findByPk(id);

    if (!existingBooking) {
      throw new UnprocessableEntityException('Booking does not exist!');
    }

    if (
      existingBooking.national_id_photo_file_key !==
      payload.national_id_photo_file_key
    ) {
      await this.commonService.deleteFile(
        existingBooking.national_id_photo_file_key,
      );
    }

    await existingBooking.update({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      country_id: existingCountry.id,
      surfing_experience: payload.surfing_experience,
      date: payload.date,
      surfboard_id: existingSurfboard.id,
      national_id_photo_file_key: payload.national_id_photo_file_key,
    });

    return this.commonService.successTimestamp();
  }

  public async delete(id: string) {
    const existingBooking = await this.bookingModel.destroy({
      where: {
        id,
      },
    });

    if (!existingBooking) {
      throw new UnprocessableEntityException('Booking does not exist!');
    }

    return this.commonService.successTimestamp();
  }
}
