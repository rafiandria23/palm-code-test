import _ from 'lodash';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Op,
  CreateOptions,
  FindAndCountOptions,
  FindOptions,
  InstanceUpdateOptions,
  InstanceDestroyOptions,
} from 'sequelize';

import {
  ReadAllMetadataDto,
  PaginationQueryDto,
  SortQueryDto,
} from '../common/common.dto';
import { CommonService } from '../common/common.service';
import { FileService } from '../file/file.service';
import { SettingService } from '../setting/setting.service';

import { Booking } from './models/booking.model';
import {
  BookingDto,
  CreateBookingBodyDto,
  ReadAllBookingsQueryDto,
  UpdateBookingBodyDto,
} from './booking.dto';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly commonService: CommonService,
    private readonly fileService: FileService,
    @InjectModel(Booking) private readonly bookingModel: typeof Booking,
    private readonly settingService: SettingService,
  ) {}

  public async create(
    payload: CreateBookingBodyDto,
    options?: CreateOptions<Booking>,
  ) {
    const [existingCountry, existingSurfboard, existingNationalIdPhotoFile] =
      await Promise.all([
        this.settingService.readCountryById(
          payload.country_id,
          _.pick(options, ['transaction']),
        ),
        this.settingService.readSurfboardById(
          payload.surfboard_id,
          _.pick(options, ['transaction']),
        ),
        this.fileService.get(payload.national_id_photo_file_key),
      ]);

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country does not exist!');
    }

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard does not exist!');
    }

    if (!existingNationalIdPhotoFile) {
      throw new UnprocessableEntityException(
        'National ID photo file key is invalid!',
      );
    }

    const createdBooking = await this.bookingModel.create(
      {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        country_id: existingCountry.id,
        surfing_experience: payload.surfing_experience,
        date: payload.date,
        surfboard_id: existingSurfboard.id,
        national_id_photo_file_key: payload.national_id_photo_file_key,
      },
      options,
    );

    const result = {
      ..._.omit(createdBooking.toJSON(), ['national_id_photo_file_key']),
      national_id_photo_url: this.fileService.getUrl(
        createdBooking.national_id_photo_file_key,
      ),
      country: existingCountry.toJSON(),
      surfboard: existingSurfboard.toJSON(),
    };

    return this.commonService.successTimestamp<undefined, BookingDto>({
      data: result,
    });
  }

  public async readAll(
    queries: ReadAllBookingsQueryDto,
    options?: Omit<
      FindAndCountOptions<Booking>,
      'group' | 'where' | 'offset' | 'limit' | 'order'
    >,
  ) {
    const finalOptions: Omit<FindAndCountOptions<Booking>, 'group'> = {
      where: {},
      offset: queries.page_size * (queries.page - 1),
      limit: queries.page_size,
      order: [[queries.sort_by, queries.sort]],
      ...options,
    };

    const filters = _.omit(queries, [
      ..._.keys(new PaginationQueryDto()),
      ..._.keys(new SortQueryDto()),
      'sort_by',
    ]);

    if (!_.isEmpty(filters)) {
      _.forOwn(filters, (filterValue, filterKey) => {
        finalOptions.where[filterKey] = {
          [Op.iLike]: `%${filterValue}%`,
        };
      });
    }

    const { count: total, rows: existingBookings } =
      await this.bookingModel.findAndCountAll(finalOptions);

    const result = [];

    for (const existingBooking of existingBookings.map((existingBooking) =>
      existingBooking.toJSON(),
    )) {
      const [existingCountry, existingSurfboard] = await Promise.all([
        this.settingService.readCountryById(
          existingBooking.country_id,
          _.pick(options, ['transaction']),
        ),
        this.settingService.readSurfboardById(
          existingBooking.surfboard_id,
          _.pick(options, ['transaction']),
        ),
      ]);

      result.push({
        ..._.omit(existingBooking, ['national_id_photo_file_key']),
        national_id_photo_url: this.fileService.getUrl(
          existingBooking.national_id_photo_file_key,
        ),
        country: existingCountry.toJSON(),
        surfboard: existingSurfboard.toJSON(),
      });
    }

    return this.commonService.successTimestamp<
      ReadAllMetadataDto,
      BookingDto[]
    >({
      metadata: {
        total,
      },
      data: result,
    });
  }

  public async readById(
    id: string,
    options?: Omit<FindOptions<Booking>, 'where'>,
  ) {
    const existingBooking = await this.bookingModel.findByPk(id, options);

    if (!existingBooking) {
      return null;
    }

    const [existingCountry, existingSurfboard] = await Promise.all([
      this.settingService.readCountryById(
        existingBooking.country_id,
        _.pick(options, ['transaction']),
      ),
      this.settingService.readSurfboardById(
        existingBooking.surfboard_id,
        _.pick(options, ['transaction']),
      ),
    ]);

    const result = {
      ..._.omit(existingBooking.toJSON(), ['national_id_photo_file_key']),
      national_id_photo_url: this.fileService.getUrl(
        existingBooking.national_id_photo_file_key,
      ),
      country: existingCountry.toJSON(),
      surfboard: existingSurfboard.toJSON(),
    };

    return result;
  }

  public async update(
    id: string,
    payload: UpdateBookingBodyDto,
    options?: InstanceUpdateOptions<Booking>,
  ) {
    const existingBooking = await this.bookingModel.findByPk(
      id,
      _.pick(options, ['transaction']),
    );

    if (!existingBooking) {
      throw new UnprocessableEntityException('Booking does not exist!');
    }

    const [existingCountry, existingSurfboard, existingNationalIdPhotoFile] =
      await Promise.all([
        this.settingService.readCountryById(
          payload.country_id,
          _.pick(options, ['transaction']),
        ),
        this.settingService.readSurfboardById(
          payload.surfboard_id,
          _.pick(options, ['transaction']),
        ),
        this.fileService.get(payload.national_id_photo_file_key),
      ]);

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country does not exist!');
    }

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard does not exist!');
    }

    if (!existingNationalIdPhotoFile) {
      throw new UnprocessableEntityException(
        'National ID photo file key is invalid!',
      );
    }

    if (
      existingBooking.national_id_photo_file_key !==
      payload.national_id_photo_file_key
    ) {
      try {
        await this.fileService.delete(
          existingBooking.national_id_photo_file_key,
        );
      } catch (err) {
        this.logger.error(err.message, err.stack, err.name);
      }
    }

    await existingBooking.update(
      {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        country_id: existingCountry.id,
        surfing_experience: payload.surfing_experience,
        date: payload.date,
        surfboard_id: existingSurfboard.id,
        national_id_photo_file_key: payload.national_id_photo_file_key,
      },
      options,
    );

    return this.commonService.successTimestamp();
  }

  public async delete(id: string, options?: InstanceDestroyOptions) {
    const existingBooking = await this.bookingModel.findByPk(
      id,
      _.pick(options, ['transaction']),
    );

    if (!existingBooking) {
      throw new UnprocessableEntityException('Booking does not exist!');
    }

    await Promise.all([
      this.fileService.delete(existingBooking.national_id_photo_file_key),
      existingBooking.destroy(options),
    ]);

    return this.commonService.successTimestamp();
  }
}
