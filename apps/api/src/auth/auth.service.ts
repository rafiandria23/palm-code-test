import _ from 'lodash';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { AppService } from '../app.service';
import { UserService } from '../user/user.service';

import { UserPassword } from './models/user-password.model';
import { SignUpDto, SignInDto } from './dtos/sign.dto';
import { UpdateEmailDto, UpdatePasswordDto } from './dtos/update.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(UserPassword)
    private readonly userPasswordModel: typeof UserPassword,
    private readonly jwtService: JwtService,
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  public async signUp(payload: SignUpDto) {
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

      return this.appService.successTimestamp({
        data: {
          access_token: accessToken,
        },
      });
    });
  }

  public async signIn(payload: SignInDto) {
    const existingUser = await this.userService.readByEmail(payload.email, {
      paranoid: false,
    });

    if (!existingUser) {
      throw new NotFoundException('User is not found!');
    }

    const existingUserPassword = await this.userPasswordModel.findOne({
      where: {
        user_id: existingUser.id,
      },
    });

    if (!existingUserPassword) {
      throw new UnprocessableEntityException('Please reset your password!');
    }

    if (
      !(await bcrypt.compare(payload.password, existingUserPassword.password))
    ) {
      throw new BadRequestException('Wrong email or password!');
    }

    const accessToken = await this.jwtService.signAsync({
      user_id: existingUser.id,
    });

    return this.appService.successTimestamp({
      data: {
        access_token: accessToken,
      },
    });
  }

  public async updateEmail(userId: string, payload: UpdateEmailDto) {
    await this.userService.updateEmail(userId, payload);

    return this.appService.successTimestamp();
  }

  public async updatePassword(userId: string, payload: UpdatePasswordDto) {
    const existingUser = await this.userService.readById(userId);

    if (!existingUser) {
      throw new NotFoundException('User is not found!');
    }

    const existingUserPassword = await this.userPasswordModel.findOne({
      where: {
        user_id: existingUser.id,
      },
    });

    if (!existingUserPassword) {
      throw new UnprocessableEntityException('Please reset your password!');
    }

    if (
      !(await bcrypt.compare(
        payload.old_password,
        existingUserPassword.password,
      ))
    ) {
      throw new BadRequestException('Wrong current password!');
    }

    await existingUserPassword.update({
      password: payload.new_password,
    });

    return this.appService.successTimestamp();
  }

  public async deactivate(userId: string) {
    await this.userService.delete(userId);

    return this.appService.successTimestamp();
  }

  public async delete(userId: string) {
    await this.userService.delete(userId, { force: true });

    return this.appService.successTimestamp();
  }
}
