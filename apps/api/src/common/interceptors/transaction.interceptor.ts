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

import { ApiRequest } from '../interfaces/api.interface';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const request = ctx.switchToHttp().getRequest<ApiRequest>();

    const transaction = await this.sequelize.transaction();

    _.set(request, 'transaction', transaction);

    return next.handle().pipe(
      tap(async () => {
        await transaction.commit();
      }),
      catchError(async (err) => {
        await transaction.rollback();

        throw err;
      }),
    );
  }
}
