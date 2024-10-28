import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CommonModule } from '../common/common.module';

import { User } from './models/user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [CommonModule, SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
