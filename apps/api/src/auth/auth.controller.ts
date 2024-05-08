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
import { ApiTags } from '@nestjs/swagger';

import { DocumentTag, Public, AuthRequest } from '../common';

import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, UpdatePasswordDto } from './dtos';

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

  @Patch('/password')
  @HttpCode(HttpStatus.OK)
  public updatePassword(
    @Request() request: AuthRequest,
    @Body() payload: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(request.auth.user_id, payload);
  }

  @Patch('/deactivate')
  @HttpCode(HttpStatus.OK)
  public deactivate(@Request() request: AuthRequest) {
    return this.authService.deactivate(request.auth.user_id);
  }

  @Delete('/')
  @HttpCode(HttpStatus.OK)
  public delete(@Request() request: AuthRequest) {
    return this.authService.delete(request.auth.user_id);
  }
}
