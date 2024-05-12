import _ from 'lodash';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions, Op } from 'sequelize';

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
    @InjectModel(Booking) private readonly bookingModel: typeof Booking,
    private readonly commonService: CommonService,
    private readonly settingService: SettingService,
  ) {}

  public async create(payload: CreateBookingBodyDto) {
    const [existingCountry, existingSurfboard] = await Promise.all([
      this.settingService.readCountryById(payload.visitor_country_id),
      this.settingService.readSurfboardById(payload.surfboard_id),
    ]);

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country does not exist!');
    }

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard does not exist!');
    }

    const createdBooking = await this.bookingModel.create({
      visitor_name: payload.visitor_name,
      visitor_email: payload.visitor_email,
      visitor_phone: payload.visitor_phone,
      visitor_country_id: existingCountry.id,
      surfing_experience: payload.surfing_experience,
      visit_date: payload.visit_date,
      surfboard_id: existingSurfboard.id,
      // @TODO: Implement upload to S3!
      national_id_photo_url: '',
    });

    return this.commonService.successTimestamp({
      data: {
        ...createdBooking,
        visitor_country: existingCountry,
        surfboard: existingSurfboard,
      },
    });
  }

  public async readAll(queries: ReadAllBookingsQueryDto) {
    const options: Omit<FindAndCountOptions<Booking>, 'group'> = {
      where: {},
      offset: queries.page_size * (queries.page - 1),
      limit: queries.page_size,
      order: [[queries.sort_by, queries.sort]],
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

    return this.commonService.successTimestamp({
      metadata: {
        total,
      },
      data: existingBookings,
    });
  }

  public async readById(id: string) {
    const existingBooking = await this.bookingModel.findByPk(id);

    if (!existingBooking) {
      return existingBooking;
    }

    const [existingCountry, existingSurfboard] = await Promise.all([
      this.settingService.readCountryById(existingBooking.visitor_country_id),
      this.settingService.readSurfboardById(existingBooking.surfboard_id),
    ]);

    return {
      ...existingBooking,
      visitor_country: existingCountry,
      surfboard: existingSurfboard,
    };
  }

  public async update(id: string, payload: UpdateBookingBodyDto) {
    const [existingCountry, existingSurfboard] = await Promise.all([
      this.settingService.readCountryById(payload.visitor_country_id),
      this.settingService.readSurfboardById(payload.surfboard_id),
    ]);

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country does not exist!');
    }

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard does not exist!');
    }

    const [existingBooking] = await this.bookingModel.update(
      {
        visitor_name: payload.visitor_name,
        visitor_email: payload.visitor_email,
        visitor_phone: payload.visitor_phone,
        visitor_country_id: existingCountry.id,
        surfing_experience: payload.surfing_experience,
        visit_date: payload.visit_date,
        surfboard_id: existingSurfboard.id,
        // @TODO: Implement upload to S3!
        national_id_photo_url: '',
      },
      {
        where: {
          id,
        },
      },
    );

    if (!existingBooking) {
      throw new UnprocessableEntityException('Booking does not exist!');
    }

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
