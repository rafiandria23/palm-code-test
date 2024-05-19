import {
  Controller,
  Post,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiExtraModels,
  ApiBearerAuth,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiRequest } from '../common/interfaces/api.interface';
import { DocumentTag } from '../common/constants/docs.constant';
import { Public } from '../common/decorators/auth.decorator';
import { RawSuccessTimestampDto } from '../common/dtos/success-timestamp.dto';

import { AuthTokenDataDto } from './dtos';
import { SignUpBodyDto, SignInBodyDto } from './dtos/sign.dto';
import { UpdateEmailBodyDto, UpdatePasswordBodyDto } from './dtos/update.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
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
  public signUp(@Body() payload: SignUpBodyDto) {
    return this.authService.signUp(payload);
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
  public signIn(@Body() payload: SignInBodyDto) {
    return this.authService.signIn(payload);
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
    @Request() request: ApiRequest,
    @Body() payload: UpdateEmailBodyDto,
  ) {
    return this.authService.updateEmail(request.auth.user_id, payload);
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
    @Request() request: ApiRequest,
    @Body() payload: UpdatePasswordBodyDto,
  ) {
    return this.authService.updatePassword(request.auth.user_id, payload);
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
  public deactivate(@Request() request: ApiRequest) {
    return this.authService.deactivate(request.auth.user_id);
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
  public delete(@Request() request: ApiRequest) {
    return this.authService.delete(request.auth.user_id);
  }
}
