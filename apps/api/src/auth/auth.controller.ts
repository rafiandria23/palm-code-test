import {
  Controller,
  UseInterceptors,
  Post,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiExtraModels,
  ApiBearerAuth,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Transaction as SequelizeTransaction } from 'sequelize';

import { ApiAuth } from '../common/common.interface';
import { SwaggerTag } from '../common/common.constant';
import { DbTransaction } from '../common/common.decorator';
import { Public, Auth } from './auth.decorator';
import { RawSuccessTimestampDto } from '../common/common.dto';
import { DbTransactionInterceptor } from '../common/common.interceptor';

import {
  AuthTokenDataDto,
  SignUpBodyDto,
  SignInBodyDto,
  UpdateEmailBodyDto,
  UpdatePasswordBodyDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
@UseInterceptors(DbTransactionInterceptor)
@ApiTags(SwaggerTag.Auth)
@ApiExtraModels(RawSuccessTimestampDto, AuthTokenDataDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(RawSuccessTimestampDto),
        },
        {
          type: 'object',
          properties: {
            data: {
              $ref: getSchemaPath(AuthTokenDataDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public signUp(
    @DbTransaction() transaction: SequelizeTransaction,
    @Body() payload: SignUpBodyDto,
  ) {
    return this.authService.signUp(payload, { transaction });
  }

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(RawSuccessTimestampDto),
        },
        {
          type: 'object',
          properties: {
            data: {
              $ref: getSchemaPath(AuthTokenDataDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public signIn(
    @DbTransaction() transaction: SequelizeTransaction,
    @Body() payload: SignInBodyDto,
  ) {
    return this.authService.signIn(payload, { transaction });
  }

  @Patch('/email')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public updateEmail(
    @DbTransaction() transaction: SequelizeTransaction,
    @Auth() auth: ApiAuth,
    @Body() payload: UpdateEmailBodyDto,
  ) {
    return this.authService.updateEmail(auth.user_id, payload, { transaction });
  }

  @Patch('/password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public updatePassword(
    @DbTransaction() transaction: SequelizeTransaction,
    @Auth() auth: ApiAuth,
    @Body() payload: UpdatePasswordBodyDto,
  ) {
    return this.authService.updatePassword(auth.user_id, payload, {
      transaction,
    });
  }

  @Delete('/deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public deactivate(
    @DbTransaction() transaction: SequelizeTransaction,
    @Auth() auth: ApiAuth,
  ) {
    return this.authService.deactivate(auth.user_id, { transaction });
  }

  @Delete('/')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public delete(
    @DbTransaction() transaction: SequelizeTransaction,
    @Auth() auth: ApiAuth,
  ) {
    return this.authService.delete(auth.user_id, { transaction });
  }
}
