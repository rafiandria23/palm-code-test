import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { MEGABYTE } from './file/file.constant';
import { SwaggerTag } from './common/common.constant';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );
  app.register(multipart, {
    limits: {
      fileSize: 5 * MEGABYTE,
    },
  });

  const configService = app.get(ConfigService);

  const globalPrefix = '/api/v1';
  app.setGlobalPrefix(globalPrefix);

  // OpenAPI (Swagger)
  const config = new DocumentBuilder()
    .setTitle('Palm Code Test API')
    .setDescription('Test for Palm Code.')
    .setVersion('1.0')
    .addTag(SwaggerTag.Setting)
    .addTag(SwaggerTag.Auth)
    .addTag(SwaggerTag.User)
    .addTag(SwaggerTag.Booking)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  const apiHost = configService.get<string>('api.host');
  const apiPort = configService.get<number>('api.port');

  app.enableCors();

  await app.listen(apiPort, apiHost);

  Logger.log(`🚀 API is running on: http://${apiHost}:${apiPort}`);
}

bootstrap();
