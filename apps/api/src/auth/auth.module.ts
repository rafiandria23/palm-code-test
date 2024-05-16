import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';

import { UserPassword } from './models/user-password.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([UserPassword]),
    CommonModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
