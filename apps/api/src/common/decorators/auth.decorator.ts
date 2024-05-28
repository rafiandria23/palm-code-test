import _ from 'lodash';
import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { ApiAuth, ApiRequest } from '../interfaces/api.interface';
import { AuthMetadata } from '../constants/auth.constant';

export const Public = () => SetMetadata(AuthMetadata.PUBLIC, true);

export const Auth = createParamDecorator<unknown, ExecutionContext, ApiAuth>(
  (__, ctx) => {
    const request = ctx.switchToHttp().getRequest<ApiRequest>();

    return _.get(request, 'auth');
  },
);
