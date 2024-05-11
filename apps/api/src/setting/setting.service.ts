import _ from 'lodash';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, FindOptions, FindAndCountOptions } from 'sequelize';

import {
  PaginationQueryDto,
  SortQueryDto,
} from '../common/dtos/pagination.dto';
import { CommonService } from '../common/common.service';

import { Country } from './models/country.model';
import { Surfboard } from './models/surfboard.model';
import {
  CreateCountryBodyDto,
  CreateSurfboardBodyDto,
} from './dtos/create.dto';
import {
  ReadAllCountriesQueryDto,
  ReadAllSurfboardsQueryDto,
} from './dtos/read.dto';
import {
  UpdateCountryBodyDto,
  UpdateSurfboardBodyDto,
} from './dtos/update.dto';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Country) private readonly countryModel: typeof Country,
    @InjectModel(Surfboard) private readonly surfboardModel: typeof Surfboard,
    private readonly commonService: CommonService,
  ) {}

  public async createCountry(payload: CreateCountryBodyDto) {
    const createdCountry = await this.countryModel.create({
      name: payload.name,
      code: payload.code,
      dial_code: payload.dial_code,
      unicode: payload.unicode,
      emoji: payload.emoji,
    });

    return this.commonService.successTimestamp({ data: createdCountry });
  }

  public async createSurfboard(payload: CreateSurfboardBodyDto) {
    const createdSurfboard = await this.surfboardModel.create({
      name: payload.name,
    });

    return this.commonService.successTimestamp({ data: createdSurfboard });
  }

  public async readAllCountries(queries: ReadAllCountriesQueryDto) {
    const options: Omit<FindAndCountOptions<Country>, 'group'> = {
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

    const { count: total, rows: existingCountries } =
      await this.countryModel.findAndCountAll(options);

    return this.commonService.successTimestamp({
      metadata: {
        total,
      },
      data: existingCountries,
    });
  }

  public readCountryById(
    id: string,
    options?: Omit<FindOptions<Country>, 'where'>,
  ) {
    return this.countryModel.findByPk(id, options);
  }

  public async readAllSurfboards(queries: ReadAllSurfboardsQueryDto) {
    const options: Omit<FindAndCountOptions<Surfboard>, 'group'> = {
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

    const { count: total, rows: existingSurfboards } =
      await this.surfboardModel.findAndCountAll(options);

    return this.commonService.successTimestamp({
      metadata: {
        total,
      },
      data: existingSurfboards,
    });
  }

  public readSurfboardById(
    id: string,
    options?: Omit<FindOptions<Surfboard>, 'where'>,
  ) {
    return this.surfboardModel.findByPk(id, options);
  }

  public async updateCountry(id: string, payload: UpdateCountryBodyDto) {
    const [existingCountry] = await this.countryModel.update(
      {
        name: payload.name,
        code: payload.code,
        dial_code: payload.dial_code,
        unicode: payload.unicode,
        emoji: payload.emoji,
      },
      {
        where: {
          id,
        },
      },
    );

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country does not exist!');
    }

    return this.commonService.successTimestamp();
  }

  public async updateSurfboard(id: string, payload: UpdateSurfboardBodyDto) {
    const [existingSurfboard] = await this.surfboardModel.update(
      {
        name: payload.name,
      },
      {
        where: {
          id,
        },
      },
    );

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard does not exist!');
    }

    return this.commonService.successTimestamp();
  }

  public async deleteCountry(id: string) {
    const existingCountry = await this.countryModel.destroy({
      where: {
        id,
      },
    });

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country does not exist!');
    }

    return this.commonService.successTimestamp();
  }

  public async deleteSurfboard(id: string) {
    const existingSurfboard = await this.surfboardModel.destroy({
      where: {
        id,
      },
    });

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard does not exist!');
    }

    return this.commonService.successTimestamp();
  }
}
