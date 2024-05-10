import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppModule } from '../app.module';

import { Country } from './models/country.model';
import { Surfboard } from './models/surfboard.model';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Country, Surfboard]),
    forwardRef(() => AppModule),
  ],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
