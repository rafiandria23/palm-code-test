import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DocumentTag } from '../common';

@Controller('/bookings')
@ApiTags(DocumentTag.BOOKING)
export class BookingController {
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public create(@Body() payload: object) {
    return;
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public readById(@Param() params: object) {
    return;
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  public readAll(@Query() queries: object) {
    return;
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  public update(@Param() params: object, @Body() payload: object) {
    return;
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  public delete(@Param() params: object) {
    return;
  }
}
