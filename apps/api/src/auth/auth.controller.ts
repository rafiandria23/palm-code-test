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

import { ApiAuth } from '../common/interfaces/api.interface';
import { DocumentTag } from '../common/constants/docs.constant';
import { Transaction } from '../common/decorators/transaction.decorator';
import { Public, Auth } from '../common/decorators/auth.decorator';
import { RawSuccessTimestampDto } from '../common/dtos/success-timestamp.dto';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';

import { AuthTokenDataDto } from './dtos';
import { SignUpBodyDto, SignInBodyDto } from './dtos/sign.dto';
import { UpdateEmailBodyDto, UpdatePasswordBodyDto } from './dtos/update.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
@UseInterceptors(TransactionInterceptor)
@ApiTags(DocumentTag.AUTH)
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
    @Body() payload: SignUpBodyDto,
    @Transaction() transaction?: SequelizeTransaction,
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
    @Body() payload: SignInBodyDto,
    @Transaction() transaction?: SequelizeTransaction,
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
    @Auth() auth: ApiAuth,
    @Body() payload: UpdateEmailBodyDto,
    @Transaction() transaction?: SequelizeTransaction,
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
    @Auth() auth: ApiAuth,
    @Body() payload: UpdatePasswordBodyDto,
    @Transaction() transaction?: SequelizeTransaction,
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
    @Auth() auth: ApiAuth,
    @Transaction() transaction?: SequelizeTransaction,
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
    @Auth() auth: ApiAuth,
    @Transaction() transaction?: SequelizeTransaction,
  ) {
    return this.authService.delete(auth.user_id, { transaction });
  }
}
