import {
  Controller,
  Post,
  Get,
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
  public async create(@Body() payload: object) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async readById(@Param() params: object) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  public async readAll(@Query() queries: object) {}
}
