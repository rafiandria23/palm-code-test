import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  const configService = app.get(ConfigService);

  const globalPrefix = '/api/v1';
  app.setGlobalPrefix(globalPrefix);

  // OpenAPI (Swagger)
  const config = new DocumentBuilder()
    .setTitle('Palm Code Test API')
    .setDescription('Test for Palm Code.')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('User')
    .addTag('Booking')
    .addBearerAuth({ type: 'http', name: 'User' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  const apiHost = configService.get<string>('api.host');
  const apiPort = configService.get<number>('api.port');

  await app.listen(apiPort, apiHost);

  Logger.log(`🚀 API is running on: http://${apiHost}:${apiPort}`);
}

bootstrap();
