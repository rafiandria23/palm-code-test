import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

import { AppService } from '../app.service';

import { User } from './models';
import { CreateUserDto } from './dtos';

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

  public readById(id: string) {
    return this.userModel.findByPk(id);
  }

  public readByEmail(email: string) {
    return this.userModel.findOne({
      where: {
        email,
      },
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
}
