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

import { ApiAuth } from '../common/common.interface';
import { SwaggerTag } from '../common/common.constant';
import { DbTransaction } from '../common/common.decorator';
import { Auth } from '../auth/auth.decorator';
import {
  RawSuccessTimestampDto,
  ReadAllMetadataDto,
} from '../common/common.dto';
import { DbTransactionInterceptor } from '../common/common.interceptor';
import { CommonService } from '../common/common.service';

import {
  UserDto,
  ReadUserByIdParamDto,
  ReadAllUsersQueryDto,
  UpdateUserBodyDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller('/users')
@UseInterceptors(DbTransactionInterceptor)
@ApiTags(SwaggerTag.User)
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
    @DbTransaction() transaction: SequelizeTransaction,
    @Query() queries: ReadAllUsersQueryDto,
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
    @DbTransaction() transaction: SequelizeTransaction,
    @Auth() auth: ApiAuth,
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
    @DbTransaction() transaction: SequelizeTransaction,
    @Param() params: ReadUserByIdParamDto,
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
    @DbTransaction() transaction: SequelizeTransaction,
    @Auth() auth: ApiAuth,
    @Body() payload: UpdateUserBodyDto,
  ) {
    return this.userService.update(auth.user_id, payload, { transaction });
  }
}
