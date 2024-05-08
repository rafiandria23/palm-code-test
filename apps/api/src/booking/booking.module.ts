import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppModule } from '../app.module';

import { Booking } from './models';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [SequelizeModule.forFeature([Booking]), forwardRef(() => AppModule)],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
