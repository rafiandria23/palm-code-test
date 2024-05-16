import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CommonModule } from '../common/common.module';
import { SettingModule } from '../setting/setting.module';

import { Booking } from './models/booking.model';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [SequelizeModule.forFeature([Booking]), CommonModule, SettingModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
