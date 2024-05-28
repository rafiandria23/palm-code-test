import _ from 'lodash';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ApiRequest } from '../interfaces/api.interface';

export const Transaction = createParamDecorator<
  unknown,
  ExecutionContext,
  ApiRequest['transaction']
>((__, ctx) => {
  const request = ctx.switchToHttp().getRequest<ApiRequest>();

  return _.get(request, 'transaction');
});
