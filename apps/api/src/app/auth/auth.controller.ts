import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DocumentTag, Public } from '../common';

import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dtos';

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
}
