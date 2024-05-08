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

import { AuthRequest } from '../interfaces';

import { AuthMetadata } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AuthMetadata.PUBLIC,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const accessToken = this.extractAccessToken(request);
    const payload = await this.authenticate(accessToken);

    _.set(request, 'auth', payload);

    return true;
  }

  private extractAccessToken(request: AuthRequest) {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is not found!');
    }

    const [type, accessToken] = authorizationHeader.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Access token type is invalid!');
    } else if (!accessToken) {
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
    } catch (err) {
      throw new UnauthorizedException('You are not authorized!');
    }
  }
}
