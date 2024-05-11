import _ from 'lodash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions, Op } from 'sequelize';

import { AppService } from '../app.service';
import {
  PaginationQueryDto,
  SortQueryDto,
} from '../common/dtos/pagination.dto';

import { Country } from './models/country.model';
import { Surfboard } from './models/surfboard.model';
import {
  ReadAllCountriesQueryDto,
  ReadAllSurfboardsQueryDto,
} from './dtos/read.dto';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Country) private readonly countryModel: typeof Country,
    @InjectModel(Surfboard) private readonly surfboardModel: typeof Surfboard,
    private readonly appService: AppService,
  ) {}

  public async readCountryById(countryId: string) {
    const existingCountry = await this.countryModel.findByPk(countryId);

    if (!existingCountry) {
      throw new NotFoundException('Country is not found!');
    }

    return this.appService.successTimestamp({ data: existingCountry });
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

    return this.appService.successTimestamp({
      metadata: {
        total,
      },
      data: existingCountries,
    });
  }

  public async readSurfboardById(surfboardId: string) {
    const existingSurfboard = await this.surfboardModel.findByPk(surfboardId);

    if (!existingSurfboard) {
      throw new NotFoundException('Surfboard is not found!');
    }

    return this.appService.successTimestamp({ data: existingSurfboard });
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

    return this.appService.successTimestamp({
      metadata: {
        total,
      },
      data: existingSurfboards,
    });
  }
}
