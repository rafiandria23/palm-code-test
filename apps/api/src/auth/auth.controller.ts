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
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

import { ApiRequest } from '../common/interfaces/api.interface';
import { DocumentTag } from '../common/constants/docs.constant';
import { Public } from '../common/decorators/auth.decorator';

import { SignUpBodyDto, SignInBodyDto } from './dtos/sign.dto';
import { UpdateEmailBodyDto, UpdatePasswordBodyDto } from './dtos/update.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
@ApiTags(DocumentTag.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  public signUp(@Body() payload: SignUpBodyDto) {
    return this.authService.signUp(payload);
  }

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  public signIn(@Body() payload: SignInBodyDto) {
    return this.authService.signIn(payload);
  }

  @ApiBearerAuth(DocumentTag.USER)
  @ApiHeader({
    required: true,
    name: 'Authorization',
    description: 'User JWT access token.',
  })
  @Patch('/email')
  @HttpCode(HttpStatus.OK)
  public updateEmail(
    @Request() request: ApiRequest,
    @Body() payload: UpdateEmailBodyDto,
  ) {
    return this.authService.updateEmail(request.auth.user_id, payload);
  }

  @ApiBearerAuth(DocumentTag.USER)
  @ApiHeader({
    required: true,
    name: 'Authorization',
    description: 'User JWT access token.',
  })
  @Patch('/password')
  @HttpCode(HttpStatus.OK)
  public updatePassword(
    @Request() request: ApiRequest,
    @Body() payload: UpdatePasswordBodyDto,
  ) {
    return this.authService.updatePassword(request.auth.user_id, payload);
  }

  @ApiBearerAuth(DocumentTag.USER)
  @ApiHeader({
    required: true,
    name: 'Authorization',
    description: 'User JWT access token.',
  })
  @Delete('/deactivate')
  @HttpCode(HttpStatus.OK)
  public deactivate(@Request() request: ApiRequest) {
    return this.authService.deactivate(request.auth.user_id);
  }

  @ApiBearerAuth(DocumentTag.USER)
  @ApiHeader({
    required: true,
    name: 'Authorization',
    description: 'User JWT access token.',
  })
  @Delete('/')
  @HttpCode(HttpStatus.OK)
  public delete(@Request() request: ApiRequest) {
    return this.authService.delete(request.auth.user_id);
  }
}
