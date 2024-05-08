import { Controller, Get, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

import { DocumentTag, AuthRequest } from '../common';

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
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  public me(@Request() request: AuthRequest) {
    return this.userService.me(request.auth.user_id);
  }
}
