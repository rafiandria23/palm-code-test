import _ from 'lodash';
import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { ApiAuth, ApiRequest } from '../common/common.interface';

import { AuthMetadata } from './auth.constant';

export const Public = () => SetMetadata(AuthMetadata.Public, true);

export const authFactory = (__: unknown, ctx: ExecutionContext): ApiAuth => {
  const request = ctx.switchToHttp().getRequest<ApiRequest>();

  return _.get(request, 'auth');
};

export const Auth = createParamDecorator<unknown, ExecutionContext, ApiAuth>(
  authFactory,
);
