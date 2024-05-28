import _ from 'lodash';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Op,
  CreateOptions,
  FindOptions,
  FindAndCountOptions,
  UpdateOptions,
  DestroyOptions,
} from 'sequelize';

import {
  ReadAllMetadataDto,
  PaginationQueryDto,
  SortQueryDto,
} from '../common/dtos/pagination.dto';
import { CommonService } from '../common/common.service';

import { User } from './models/user.model';
import { UserDto } from './dtos';
import { CreateUserBodyDto } from './dtos/create.dto';
import { ReadAllUsersQueryDto } from './dtos/read.dto';
import { UpdateUserEmailBodyDto, UpdateUserBodyDto } from './dtos/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly commonService: CommonService,
  ) {}

  public create(payload: CreateUserBodyDto, options?: CreateOptions<User>) {
    return this.userModel.create(
      {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
      },
      options,
    );
  }

  public async readAll(
    queries: ReadAllUsersQueryDto,
    options?: Omit<
      FindAndCountOptions<User>,
      'group' | 'where' | 'offset' | 'limit' | 'order'
    >,
  ) {
    const finalOptions: Omit<FindAndCountOptions<User>, 'group'> = {
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

    const { count: total, rows: existingUsers } =
      await this.userModel.findAndCountAll(finalOptions);

    return this.commonService.successTimestamp<ReadAllMetadataDto, UserDto[]>({
      metadata: {
        total,
      },
      data: existingUsers,
    });
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

  public async update(
    id: string,
    payload: UpdateUserBodyDto,
    options?: Omit<UpdateOptions<User>, 'where'>,
  ) {
    const [existingUser] = await this.userModel.update(
      {
        first_name: payload.first_name,
        last_name: payload.last_name,
      },
      {
        where: {
          id,
        },
        ...options,
      },
    );

    if (!existingUser) {
      throw new UnprocessableEntityException('User does not exist!');
    }

    return this.commonService.successTimestamp();
  }

  public async updateEmail(
    id: string,
    payload: UpdateUserEmailBodyDto,
    options?: Omit<UpdateOptions<User>, 'where'>,
  ) {
    const [existingUser] = await this.userModel.update(
      {
        email: payload.email,
      },
      {
        where: {
          id,
        },
        ...options,
      },
    );

    if (!existingUser) {
      throw new UnprocessableEntityException('User does not exist!');
    }
  }

  public async delete(
    id: string,
    options?: Omit<DestroyOptions<User>, 'where'>,
  ) {
    const existingUser = await this.userModel.destroy({
      where: {
        id,
      },
      ...options,
    });

    if (!existingUser) {
      throw new UnprocessableEntityException('User does not exist!');
    }
  }
}
