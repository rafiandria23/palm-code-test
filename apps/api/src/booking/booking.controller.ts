import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  // Request,
  Body,
  Param,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// import { AuthRequest } from '../common/interfaces/request.interface';
import { DocumentTag } from '../common/constants/docs.constant';
import { CommonService } from '../common/common.service';

import { CreateBookingBodyDto } from './dtos/create.dto';
import {
  ReadBookingByIdParamDto,
  ReadAllBookingsQueryDto,
} from './dtos/read.dto';
import { UpdateBookingParamDto, UpdateBookingBodyDto } from './dtos/update.dto';
import { DeleteBookingParamDto } from './dtos/delete.dto';
import { BookingService } from './booking.service';

@Controller('/bookings')
@ApiTags(DocumentTag.BOOKING)
export class BookingController {
  constructor(
    private readonly commonService: CommonService,
    private readonly bookingService: BookingService,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public create(
    // @Request() request: AuthRequest,
    @Body() payload: CreateBookingBodyDto,
  ) {
    return this.bookingService.create(payload);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  public readAll(@Query() queries: ReadAllBookingsQueryDto) {
    return this.bookingService.readAll(queries);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param() params: ReadBookingByIdParamDto) {
    const existingBooking = await this.bookingService.readById(params.id);

    if (!existingBooking) {
      throw new UnprocessableEntityException('Booking is not found!');
    }

    return this.commonService.successTimestamp({ data: existingBooking });
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  public update(
    @Param() params: UpdateBookingParamDto,
    @Body() payload: UpdateBookingBodyDto,
  ) {
    return this.bookingService.update(params.id, payload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  public delete(@Param() params: DeleteBookingParamDto) {
    return this.bookingService.delete(params.id);
  }
}
