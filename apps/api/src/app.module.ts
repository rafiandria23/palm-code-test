import { APP_PIPE, APP_GUARD, APP_FILTER } from '@nestjs/core';
import {
  Logger,
  Module,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { apiConfig } from './common/configs/api.config';
import { dbConfig } from './common/configs/db.config';
import { jwtConfig } from './common/configs/jwt.config';
import { awsConfig } from './common/configs/aws.config';
import { AuthGuard } from './common/guards/auth.guard';
import { ExceptionFilter } from './common/filters/exception.filter';
import { CommonModule } from './common/common.module';
import { SettingModule } from './setting/setting.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';

import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [apiConfig, dbConfig, jwtConfig, awsConfig],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        return {
          dialect: 'postgres',
          dialectOptions: {
            ssl:
              configService.get<string>('db.sll') === 'true'
                ? {
                    require: true,
                    rejectUnauthorized: true,
                  }
                : undefined,
          },
          host: configService.get<string>('db.host'),
          port: configService.get<number>('db.port'),
          username: configService.get<string>('db.user'),
          password: configService.get<string>('db.pass'),
          database: configService.get<string>('db.name'),
          autoLoadModels: true,
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        return {
          secret: configService.get<string>('jwt.secret'),
          signOptions: {
            issuer: 'Palm Code',
          },
        };
      },
    }),
    CommonModule,
    SettingModule,
    AuthModule,
    UserModule,
    BookingModule,
  ],
  providers: [
    Logger,
    AppService,
    {
      provide: APP_PIPE,
      useFactory() {
        return new ValidationPipe({
          exceptionFactory(data) {
            return new BadRequestException(data);
          },
          validationError: {
            target: false,
            value: false,
          },
          whitelist: true,
          forbidNonWhitelisted: true,
        });
      },
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
  exports: [AppService],
})
export class AppModule {}
