import _ from 'lodash';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Op,
  CreateOptions,
  FindAndCountOptions,
  FindOptions,
  UpdateOptions,
  DestroyOptions,
} from 'sequelize';

import {
  ReadAllMetadataDto,
  PaginationQueryDto,
  SortQueryDto,
} from '../common/dtos/pagination.dto';
import { CommonService } from '../common/common.service';

import { Country } from './models/country.model';
import { Surfboard } from './models/surfboard.model';
import { CountryDto, SurfboardDto } from './dtos';
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

  public async createCountry(
    payload: CreateCountryBodyDto,
    options?: CreateOptions<Country>,
  ) {
    const createdCountry = await this.countryModel.create(
      {
        name: payload.name,
        code: payload.code,
        dial_code: payload.dial_code,
        emoji: payload.emoji,
      },
      options,
    );

    return this.commonService.successTimestamp<undefined, CountryDto>({
      data: createdCountry,
    });
  }

  public async createSurfboard(
    payload: CreateSurfboardBodyDto,
    options?: CreateOptions<Surfboard>,
  ) {
    const createdSurfboard = await this.surfboardModel.create(
      {
        name: payload.name,
      },
      options,
    );

    return this.commonService.successTimestamp<undefined, SurfboardDto>({
      data: createdSurfboard,
    });
  }

  public async readAllCountries(
    queries: ReadAllCountriesQueryDto,
    options?: Omit<
      FindAndCountOptions<Country>,
      'group' | 'where' | 'offset' | 'limit' | 'order'
    >,
  ) {
    const finalOptions: Omit<FindAndCountOptions<Country>, 'group'> = {
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

    const { count: total, rows: existingCountries } =
      await this.countryModel.findAndCountAll(finalOptions);

    return this.commonService.successTimestamp<
      ReadAllMetadataDto,
      CountryDto[]
    >({
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

  public async readAllSurfboards(
    queries: ReadAllSurfboardsQueryDto,
    options?: Omit<
      FindAndCountOptions<Surfboard>,
      'group' | 'where' | 'offset' | 'limit' | 'order'
    >,
  ) {
    const finalOptions: Omit<FindAndCountOptions<Surfboard>, 'group'> = {
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

    const { count: total, rows: existingSurfboards } =
      await this.surfboardModel.findAndCountAll(finalOptions);

    return this.commonService.successTimestamp<
      ReadAllMetadataDto,
      SurfboardDto[]
    >({
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

  public async updateCountry(
    id: string,
    payload: UpdateCountryBodyDto,
    options?: Omit<UpdateOptions<Country>, 'where'>,
  ) {
    const [existingCountry] = await this.countryModel.update(
      {
        name: payload.name,
        code: payload.code,
        dial_code: payload.dial_code,
        emoji: payload.emoji,
      },
      {
        where: {
          id,
        },
        ...options,
      },
    );

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country does not exist!');
    }

    return this.commonService.successTimestamp();
  }

  public async updateSurfboard(
    id: string,
    payload: UpdateSurfboardBodyDto,
    options?: Omit<UpdateOptions<Surfboard>, 'where'>,
  ) {
    const [existingSurfboard] = await this.surfboardModel.update(
      {
        name: payload.name,
      },
      {
        where: {
          id,
        },
        ...options,
      },
    );

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard does not exist!');
    }

    return this.commonService.successTimestamp();
  }

  public async deleteCountry(
    id: string,
    options?: Omit<DestroyOptions<Country>, 'where'>,
  ) {
    const existingCountry = await this.countryModel.destroy({
      where: {
        id,
      },
      ...options,
    });

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country does not exist!');
    }

    return this.commonService.successTimestamp();
  }

  public async deleteSurfboard(
    id: string,
    options?: Omit<DestroyOptions<Surfboard>, 'where'>,
  ) {
    const existingSurfboard = await this.surfboardModel.destroy({
      where: {
        id,
      },
      ...options,
    });

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard does not exist!');
    }

    return this.commonService.successTimestamp();
  }
}
