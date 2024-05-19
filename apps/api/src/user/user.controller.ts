import {
  Controller,
  Get,
  Put,
  HttpCode,
  HttpStatus,
  Request,
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

import { ApiRequest } from '../common/interfaces/api.interface';
import { DocumentTag } from '../common/constants/docs.constant';
import { RawSuccessTimestampDto } from '../common/dtos/success-timestamp.dto';
import { ReadAllMetadataDto } from '../common/dtos/pagination.dto';
import { CommonService } from '../common/common.service';

import { UserDto } from './dtos';
import { ReadUserByIdParamDto, ReadAllUsersQueryDto } from './dtos/read.dto';
import { UpdateUserBodyDto } from './dtos/update.dto';
import { UserService } from './user.service';

@Controller('/users')
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
  public readAll(@Query() queries: ReadAllUsersQueryDto) {
    return this.userService.readAll(queries);
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
  public async me(@Request() request: ApiRequest) {
    const existingUser = await this.userService.readById(request.auth.user_id);

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
  public async readById(@Param() params: ReadUserByIdParamDto) {
    const existingUser = await this.userService.readById(params.id);

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
    @Request() request: ApiRequest,
    @Body() payload: UpdateUserBodyDto,
  ) {
    return this.userService.update(request.auth.user_id, payload);
  }
}
