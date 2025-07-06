import _ from 'lodash';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ApiRequest } from './common.interface';

export const dbTransactionFactory = (
  __: unknown,
  ctx: ExecutionContext,
): ApiRequest['db']['transaction'] => {
  const request = ctx.switchToHttp().getRequest<ApiRequest>();

  return _.get(request, 'db.transaction');
};

export const DbTransaction = createParamDecorator<
  unknown,
  ApiRequest['db']['transaction']
>(dbTransactionFactory);
