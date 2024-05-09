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
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

import { AppService } from '../app.service';
import { DocumentTag, AuthRequest } from '../common';

import { UserService } from './user.service';
import {
  ReadUserByIdParamDto,
  ReadAllUsersQueryDto,
  UpdateUserDto,
} from './dtos';

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
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  public me(@Request() request: AuthRequest) {
    return this.userService.me(request.auth.user_id);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param() params: ReadUserByIdParamDto) {
    const existingUser = await this.userService.readById(params.id);

    if (!existingUser) {
      throw new NotFoundException('User is not found!');
    }

    return this.appService.successTimestamp({ data: existingUser });
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  public readAll(@Query() queries: ReadAllUsersQueryDto) {
    return this.userService.readAll(queries);
  }

  @Put('/')
  @HttpCode(HttpStatus.OK)
  public update(
    @Request() request: AuthRequest,
    @Body() payload: UpdateUserDto,
  ) {
    return this.userService.update(request.auth.user_id, payload);
  }
}
