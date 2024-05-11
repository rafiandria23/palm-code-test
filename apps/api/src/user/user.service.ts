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

import {
  PaginationQueryDto,
  SortQueryDto,
} from '../common/dtos/pagination.dto';
import { CommonService } from '../common/common.service';

import { User } from './models/user.model';
import { CreateUserBodyDto } from './dtos/create.dto';
import { ReadAllUsersQueryDto } from './dtos/read.dto';
import { UpdateUserEmailBodyDto, UpdateUserBodyDto } from './dtos/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly commonService: CommonService,
  ) {}

  public create(payload: CreateUserBodyDto, transaction?: Transaction) {
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

    return this.commonService.successTimestamp({
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

    const { count: total, rows: existingUsers } =
      await this.userModel.findAndCountAll(options);

    return this.commonService.successTimestamp({
      metadata: {
        total,
      },
      data: existingUsers,
    });
  }

  public async updateEmail(
    id: string,
    payload: UpdateUserEmailBodyDto,
    transaction?: Transaction,
  ) {
    const existingUser = await this.readByEmail(payload.email);

    if (existingUser !== null) {
      throw new UnprocessableEntityException('Email is not available!');
    }

    await existingUser.update(
      {
        email: payload.email,
      },
      { transaction },
    );
  }

  public async update(
    id: string,
    payload: UpdateUserBodyDto,
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

    return this.commonService.successTimestamp();
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
