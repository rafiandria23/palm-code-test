import _ from 'lodash';
import { HttpAdapterHost } from '@nestjs/core';
import {
  Catch,
  ExceptionFilter as NestExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { isString } from 'tipe-apa';

import { AppService } from '../../app.service';

@Catch()
export class ExceptionFilter
  implements NestExceptionFilter<HttpException | Error>
{
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost<FastifyAdapter>,
    private readonly appService: AppService,
  ) {}

  public catch(exception: HttpException | Error, host: ArgumentsHost) {
    const httpHost = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    let errStatus: HttpStatus = _.defaultTo(
      _.get(exception, 'status'),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    let errData: string | object = _.defaultTo(
      _.get(exception, 'data'),
      'Oops! Something unexpected occurred.',
    );

    if (exception instanceof HttpException) {
      errStatus = exception.getStatus();
      errData = _.get(
        _.omit(exception.getResponse() as object, ['statusCode', 'error']),
        'message',
      );
    } else {
      // @TODO: Change this with Nest.js' own LoggerService
      console.error(exception);
    }

    if (isString(errData)) {
      errData = {
        message: errData,
      };
    }

    return httpAdapter.reply(
      httpHost.getResponse(),
      this.appService.successTimestamp({
        success: false,
        data: errData,
      }),
      errStatus,
    );
  }
}
