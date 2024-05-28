import {
  Controller,
  UseInterceptors,
  Get,
  Put,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Body,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Transaction as SequelizeTransaction } from 'sequelize';

import { ApiAuth } from '../common/interfaces/api.interface';
import { DocumentTag } from '../common/constants/docs.constant';
import { Transaction } from '../common/decorators/transaction.decorator';
import { Auth } from '../common/decorators/auth.decorator';
import { RawSuccessTimestampDto } from '../common/dtos/success-timestamp.dto';
import { ReadAllMetadataDto } from '../common/dtos/pagination.dto';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { CommonService } from '../common/common.service';

import { UserDto } from './dtos';
import { ReadUserByIdParamDto, ReadAllUsersQueryDto } from './dtos/read.dto';
import { UpdateUserBodyDto } from './dtos/update.dto';
import { UserService } from './user.service';

@Controller('/users')
@UseInterceptors(TransactionInterceptor)
@ApiTags(DocumentTag.USER)
@ApiBearerAuth()
@ApiExtraModels(RawSuccessTimestampDto, ReadAllMetadataDto, UserDto)
export class UserController {
  constructor(
    private readonly commonService: CommonService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
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
            metadata: {
              $ref: getSchemaPath(ReadAllMetadataDto),
            },
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(UserDto),
              },
            },
          },
          required: ['metadata', 'data'],
        },
      ],
    },
  })
  public readAll(
    @Query() queries: ReadAllUsersQueryDto,
    @Transaction() transaction?: SequelizeTransaction,
  ) {
    return this.userService.readAll(queries, {
      transaction,
    });
  }

  @Get('/me')
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
              $ref: getSchemaPath(UserDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public async me(
    @Auth() auth: ApiAuth,
    @Transaction() transaction?: SequelizeTransaction,
  ) {
    const existingUser = await this.userService.readById(auth.user_id, {
      transaction,
    });

    if (!existingUser) {
      throw new UnprocessableEntityException('User does not exist!');
    }

    return this.commonService.successTimestamp<undefined, UserDto>({
      data: existingUser,
    });
  }

  @Get('/:id')
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
              $ref: getSchemaPath(RawSuccessTimestampDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public async readById(
    @Param() params: ReadUserByIdParamDto,
    @Transaction() transaction?: SequelizeTransaction,
  ) {
    const existingUser = await this.userService.readById(params.id, {
      transaction,
    });

    if (!existingUser) {
      throw new UnprocessableEntityException('User does not exist!');
    }

    return this.commonService.successTimestamp<undefined, UserDto>({
      data: existingUser,
    });
  }

  @Put('/')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public update(
    @Auth() auth: ApiAuth,
    @Body() payload: UpdateUserBodyDto,
    @Transaction() transaction?: SequelizeTransaction,
  ) {
    return this.userService.update(auth.user_id, payload, { transaction });
  }
}
