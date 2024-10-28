import _ from 'lodash';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ApiRequest } from '../common/common.interface';

import { AuthMetadata } from './auth.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AuthMetadata.Public,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (isPublic) {
      return isPublic;
    }

    const request = ctx.switchToHttp().getRequest<ApiRequest>();
    const accessToken = this.extractAccessToken(request);
    const payload = await this.authenticate(accessToken);

    _.set(request, 'auth', payload);

    return true;
  }

  private extractAccessToken(request: ApiRequest) {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is not found!');
    }

    const [type, accessToken] = authorizationHeader.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Access token type is invalid!');
    }

    if (!accessToken) {
      throw new UnauthorizedException('Access token is not found!');
    }

    return accessToken;
  }

  private async authenticate(accessToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      return payload;
    } catch {
      throw new UnauthorizedException('You are not authorized!');
    }
  }
}
