import _ from 'lodash';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { tap, catchError } from 'rxjs';

import { ApiRequest } from './common.interface';

@Injectable()
export class DbTransactionInterceptor implements NestInterceptor {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const request = ctx.switchToHttp().getRequest<ApiRequest>();

    const dbTransaction = await this.sequelize.transaction();

    _.set(request, 'db.transaction', dbTransaction);

    return next.handle().pipe(
      tap(async () => {
        await dbTransaction.commit();
      }),
      catchError(async (err) => {
        await dbTransaction.rollback();

        throw err;
      }),
    );
  }
}
