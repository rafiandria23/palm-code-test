import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CommonModule } from '../common/common.module';

import { Country } from './models/country.model';
import { Surfboard } from './models/surfboard.model';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

@Module({
  imports: [CommonModule, SequelizeModule.forFeature([Country, Surfboard])],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
