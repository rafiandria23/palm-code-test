import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppModule } from '../app.module';
import { UserModule } from '../user/user.module';

import { UserPassword } from './models/user-password.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([UserPassword]),
    forwardRef(() => AppModule),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
