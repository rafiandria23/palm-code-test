import _ from 'lodash';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { CommonService } from '../common/common.service';
import { UserService } from '../user/user.service';

import { UserPassword } from './models/user-password.model';
import {
  AuthTokenDataDto,
  SignUpBodyDto,
  SignInBodyDto,
  UpdateEmailBodyDto,
  UpdatePasswordBodyDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
    @InjectModel(UserPassword)
    private readonly userPasswordModel: typeof UserPassword,
    private readonly userService: UserService,
  ) {}

  public async signUp(
    payload: SignUpBodyDto,
    options?: { transaction?: Transaction },
  ) {
    const existingUser = await this.userService.readByEmail(payload.email, {
      paranoid: false,
      ...options,
    });

    if (existingUser !== null) {
      throw new UnprocessableEntityException('User already exists!');
    }

    const createdUser = await this.userService.create(
      _.omit(payload, ['password']),
      {
        ...options,
      },
    );

    const [accessToken] = await Promise.all([
      this.jwtService.signAsync({ user_id: createdUser.id }),
      this.userPasswordModel.create(
        {
          user_id: createdUser.id,
          hash: payload.password,
        },
        options,
      ),
    ]);

    return this.commonService.successTimestamp<undefined, AuthTokenDataDto>({
      data: {
        access_token: accessToken,
      },
    });
  }

  public async signIn(
    payload: SignInBodyDto,
    options?: { transaction?: Transaction },
  ) {
    const existingUser = await this.userService.readByEmail(payload.email, {
      paranoid: false,
      ...options,
    });

    if (!existingUser) {
      throw new UnprocessableEntityException('User does not exist!');
    }

    const existingUserPassword = await this.userPasswordModel.findOne({
      where: {
        user_id: existingUser.id,
      },
      paranoid: false,
      ...options,
    });

    if (!existingUserPassword) {
      throw new UnprocessableEntityException('Please reset your password!');
    }

    if (!(await bcrypt.compare(payload.password, existingUserPassword.hash))) {
      throw new UnprocessableEntityException('Wrong email or password!');
    }

    if (
      [existingUser.deleted_at, existingUserPassword.deleted_at].some(
        (deleted) => deleted !== null,
      )
    ) {
      await Promise.all([
        existingUser.restore(options),
        existingUserPassword.restore(options),
      ]);
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

  public async updateEmail(
    id: string,
    payload: UpdateEmailBodyDto,
    options?: { transaction?: Transaction },
  ) {
    const existingUser = await this.userService.readByEmail(
      payload.email,
      options,
    );

    if (existingUser !== null) {
      if (existingUser.id === id) {
        throw new UnprocessableEntityException('Email is already yours!');
      }

      throw new UnprocessableEntityException('Email is not available!');
    }

    await this.userService.updateEmail(id, payload, options);

    return this.commonService.successTimestamp();
  }

  public async updatePassword(
    id: string,
    payload: UpdatePasswordBodyDto,
    options?: { transaction?: Transaction },
  ) {
    const existingUserPassword = await this.userPasswordModel.findOne({
      where: {
        user_id: id,
      },
      ...options,
    });

    if (!existingUserPassword) {
      throw new UnprocessableEntityException('Please reset your password!');
    }

    const [oldPasswordComparison, newPasswordComparison] = await Promise.all([
      bcrypt.compare(payload.old_password, existingUserPassword.hash),
      bcrypt.compare(payload.new_password, existingUserPassword.hash),
    ]);

    if (!oldPasswordComparison) {
      throw new UnprocessableEntityException('Wrong password!');
    }

    if (newPasswordComparison) {
      throw new UnprocessableEntityException('Password is identical!');
    }

    await existingUserPassword.update(
      {
        hash: payload.new_password,
      },
      options,
    );

    return this.commonService.successTimestamp();
  }

  public async deactivate(id: string, options?: { transaction?: Transaction }) {
    await Promise.all([
      this.userService.delete(id, options),
      this.userPasswordModel.destroy({ where: { user_id: id }, ...options }),
    ]);

    return this.commonService.successTimestamp();
  }

  public async delete(id: string, options?: { transaction?: Transaction }) {
    await Promise.all([
      this.userService.delete(id, { force: true, ...options }),
      this.userPasswordModel.destroy({
        where: { user_id: id },
        force: true,
        ...options,
      }),
    ]);

    return this.commonService.successTimestamp();
  }
}
