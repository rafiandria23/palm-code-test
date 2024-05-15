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
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

import { ApiRequest } from '../common/interfaces/api.interface';
import { DocumentTag } from '../common/constants/docs.constant';
import { CommonService } from '../common/common.service';

import { ReadUserByIdParamDto, ReadAllUsersQueryDto } from './dtos/read.dto';
import { UpdateUserBodyDto } from './dtos/update.dto';
import { UserService } from './user.service';

@ApiTags(DocumentTag.USER)
@ApiBearerAuth(DocumentTag.USER)
@ApiHeader({
  required: true,
  name: 'Authorization',
  description: 'User JWT access token.',
})
@Controller('/users')
export class UserController {
  constructor(
    private readonly commonService: CommonService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  public readAll(@Query() queries: ReadAllUsersQueryDto) {
    return this.userService.readAll(queries);
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  public me(@Request() request: ApiRequest) {
    return this.userService.me(request.auth.user_id);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param() params: ReadUserByIdParamDto) {
    const existingUser = await this.userService.readById(params.id);

    if (!existingUser) {
      throw new UnprocessableEntityException('User does not exist!');
    }

    return this.commonService.successTimestamp({ data: existingUser });
  }

  @Put('/')
  @HttpCode(HttpStatus.OK)
  public update(
    @Request() request: ApiRequest,
    @Body() payload: UpdateUserBodyDto,
  ) {
    return this.userService.update(request.auth.user_id, payload);
  }
}
