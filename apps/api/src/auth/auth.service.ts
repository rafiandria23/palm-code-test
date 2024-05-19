import _ from 'lodash';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { CommonService } from '../common/common.service';
import { UserService } from '../user/user.service';

import { UserPassword } from './models/user-password.model';
import { AuthTokenDataDto } from './dtos';
import { SignUpBodyDto, SignInBodyDto } from './dtos/sign.dto';
import { UpdateEmailBodyDto, UpdatePasswordBodyDto } from './dtos/update.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(UserPassword)
    private readonly userPasswordModel: typeof UserPassword,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async signUp(payload: SignUpBodyDto) {
    const existingUser = await this.userService.readByEmail(payload.email, {
      paranoid: false,
    });

    if (existingUser !== null) {
      throw new UnprocessableEntityException('User already exists!');
    }

    return this.sequelize.transaction(async (transaction) => {
      const createdUser = await this.userService.create(
        _.omit(payload, ['password']),
        transaction,
      );

      const [accessToken] = await Promise.all([
        this.jwtService.signAsync({ user_id: createdUser.id }),
        this.userPasswordModel.create(
          {
            user_id: createdUser.id,
            password: payload.password,
          },
          { transaction },
        ),
      ]);

      return this.commonService.successTimestamp<undefined, AuthTokenDataDto>({
        data: {
          access_token: accessToken,
        },
      });
    });
  }

  public async signIn(payload: SignInBodyDto) {
    const existingUser = await this.userService.readByEmail(payload.email, {
      paranoid: false,
    });

    if (!existingUser) {
      throw new UnprocessableEntityException('User does not exist!');
    }

    const existingUserPassword = await this.userPasswordModel.findOne({
      where: {
        user_id: existingUser.id,
      },
      paranoid: false,
    });

    if (!existingUserPassword) {
      throw new UnprocessableEntityException('Please reset your password!');
    }

    if (
      !(await bcrypt.compare(payload.password, existingUserPassword.password))
    ) {
      throw new UnprocessableEntityException('Wrong email or password!');
    }

    if (
      [existingUser.deleted_at, existingUserPassword.deleted_at].some(
        (deleted) => deleted !== null,
      )
    ) {
      await this.sequelize.transaction(async (transaction) => {
        await Promise.all([
          existingUser.restore({ transaction }),
          existingUserPassword.restore({ transaction }),
        ]);
      });
    }

    const accessToken = await this.jwtService.signAsync({
      user_id: existingUser.id,
    });

    return this.commonService.successTimestamp<undefined, AuthTokenDataDto>({
      data: {
        access_token: accessToken,
      },
    });
  }

  public async updateEmail(id: string, payload: UpdateEmailBodyDto) {
    const existingUser = await this.userService.readByEmail(payload.email);

    if (existingUser !== null) {
      if (existingUser.id === id) {
        throw new UnprocessableEntityException('Email is already yours!');
      }

      throw new UnprocessableEntityException('Email is not available!');
    }

    await this.userService.updateEmail(id, payload);

    return this.commonService.successTimestamp();
  }

  public async updatePassword(id: string, payload: UpdatePasswordBodyDto) {
    const existingUserPassword = await this.userPasswordModel.findOne({
      where: {
        user_id: id,
      },
    });

    if (!existingUserPassword) {
      throw new UnprocessableEntityException('Please reset your password!');
    }

    const [oldPasswordComparison, newPasswordComparison] = await Promise.all([
      bcrypt.compare(payload.old_password, existingUserPassword.password),
      bcrypt.compare(payload.new_password, existingUserPassword.password),
    ]);

    if (!oldPasswordComparison) {
      throw new UnprocessableEntityException('Wrong password!');
    }

    if (newPasswordComparison) {
      throw new UnprocessableEntityException('Password is identical!');
    }

    await existingUserPassword.update({
      password: payload.new_password,
    });

    return this.commonService.successTimestamp();
  }

  public async deactivate(id: string) {
    await this.sequelize.transaction(async (transaction) => {
      await Promise.all([
        this.userService.delete(id, { transaction }),
        this.userPasswordModel.destroy({ where: { user_id: id }, transaction }),
      ]);
    });

    return this.commonService.successTimestamp();
  }

  public async delete(id: string) {
    await this.sequelize.transaction(async (transaction) => {
      await Promise.all([
        this.userService.delete(id, { force: true, transaction }),
        this.userPasswordModel.destroy({
          where: { user_id: id },
          force: true,
          transaction,
        }),
      ]);
    });

    return this.commonService.successTimestamp();
  }
}
