import {
  Controller,
  Post,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

import { AuthRequest } from '../common/interfaces/request.interface';
import { Public } from '../common/decorators/auth.decorator';
import { DocumentTag } from '../common/constants/docs.constant';

import { SignUpDto, SignInDto } from './dtos/sign.dto';
import { UpdateEmailDto, UpdatePasswordDto } from './dtos/update.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
@ApiTags(DocumentTag.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  public signUp(@Body() payload: SignUpDto) {
    return this.authService.signUp(payload);
  }

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  public signIn(@Body() payload: SignInDto) {
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
    @Request() request: AuthRequest,
    @Body() payload: UpdateEmailDto,
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
    @Request() request: AuthRequest,
    @Body() payload: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(request.auth.user_id, payload);
  }

  @ApiBearerAuth(DocumentTag.USER)
  @ApiHeader({
    required: true,
    name: 'Authorization',
    description: 'User JWT access token.',
  })
  @Patch('/deactivate')
  @HttpCode(HttpStatus.OK)
  public deactivate(@Request() request: AuthRequest) {
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
  public delete(@Request() request: AuthRequest) {
    return this.authService.delete(request.auth.user_id);
  }
}
