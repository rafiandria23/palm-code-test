import _ from 'lodash';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Transaction,
  Op,
  FindOptions,
  FindAndCountOptions,
  DestroyOptions,
} from 'sequelize';

import { AppService } from '../app.service';
import { PaginationDto, SortDto } from '../common/dtos/pagination.dto';

import { User } from './models/user.model';
import { CreateUserDto } from './dtos/create.dto';
import { ReadAllUsersQueryDto } from './dtos/read.dto';
import { UpdateUserEmailDto, UpdateUserDto } from './dtos/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly appService: AppService,
  ) {}

  public create(payload: CreateUserDto, transaction?: Transaction) {
    return this.userModel.create(
      {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
      },
      {
        transaction,
      },
    );
  }

  public readById(id: string, options?: Omit<FindOptions<User>, 'where'>) {
    return this.userModel.findByPk(id, options);
  }

  public readByEmail(
    email: string,
    options?: Omit<FindOptions<User>, 'where'>,
  ) {
    return this.userModel.findOne({
      where: {
        email,
      },
      ...options,
    });
  }

  public async me(id: string) {
    const existingUser = await this.readById(id);

    if (!existingUser) {
      throw new NotFoundException('User is not found!');
    }

    return this.appService.successTimestamp({
      data: existingUser,
    });
  }

  public async readAll(queries: ReadAllUsersQueryDto) {
    const options: Omit<FindAndCountOptions<User>, 'group'> = {
      where: {},
      offset: queries.page_size * (queries.page - 1),
      limit: queries.page_size,
      order: [[queries.sort_by, queries.sort]],
    };

    const filters = _.omit(queries, [
      ..._.keys(new PaginationDto()),
      ..._.keys(new SortDto()),
      'sort_by',
    ]);

    if (!_.isEmpty(filters)) {
      _.forOwn(filters, (filterValue, filterKey) => {
        options.where[filterKey] = {
          [Op.iLike]: `%${filterValue}%`,
        };
      });
    }

    const { count: total, rows: existingUsers } =
      await this.userModel.findAndCountAll(options);

    return this.appService.successTimestamp({
      metadata: {
        total,
      },
      data: existingUsers,
    });
  }

  public async updateEmail(
    id: string,
    payload: UpdateUserEmailDto,
    transaction?: Transaction,
  ) {
    const existingUser = await this.readByEmail(payload.email);

    if (existingUser) {
      throw new UnprocessableEntityException('Email is not available!');
    }

    await this.userModel.update(
      {
        email: payload.email,
      },
      {
        where: {
          id,
        },
        transaction,
      },
    );
  }

  public async update(
    id: string,
    payload: UpdateUserDto,
    transaction?: Transaction,
  ) {
    await this.userModel.update(
      {
        first_name: payload.first_name,
        last_name: payload.last_name,
      },
      {
        where: {
          id,
        },
        transaction,
      },
    );

    return this.appService.successTimestamp();
  }

  public async delete(
    id: string,
    options?: Omit<DestroyOptions<User>, 'where'>,
  ) {
    await this.userModel.destroy({
      where: {
        id,
      },
      ...options,
    });
  }
}
