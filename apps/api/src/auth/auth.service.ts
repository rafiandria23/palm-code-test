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

import { CommonService } from '../common/common.service';
import { UserService } from '../user/user.service';

import { UserPassword } from './models/user-password.model';
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

      return this.commonService.successTimestamp({
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

    if (existingUser.deleted_at !== null) {
      await existingUser.restore();
    }

    const accessToken = await this.jwtService.signAsync({
      user_id: existingUser.id,
    });

    return this.commonService.successTimestamp({
      data: {
        access_token: accessToken,
      },
    });
  }

  public async updateEmail(id: string, payload: UpdateEmailBodyDto) {
    await this.userService.updateEmail(id, payload);

    return this.commonService.successTimestamp();
  }

  public async updatePassword(id: string, payload: UpdatePasswordBodyDto) {
    const existingUser = await this.userService.readById(id);

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

    return this.commonService.successTimestamp();
  }

  public async deactivate(id: string) {
    await this.userService.delete(id);

    return this.commonService.successTimestamp();
  }

  public async delete(id: string) {
    await this.userService.delete(id, { force: true });

    return this.commonService.successTimestamp();
  }
}
