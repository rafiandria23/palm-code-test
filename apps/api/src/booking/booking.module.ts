import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppModule } from '../app.module';

import { Booking } from './models/booking.model';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [SequelizeModule.forFeature([Booking]), forwardRef(() => AppModule)],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
