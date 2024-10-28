import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Body,
  Param,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExtraModels,
  ApiConsumes,
  ApiBody,
  ApiResponse as SwaggerApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Transaction as SequelizeTransaction } from 'sequelize';

import { ApiFile } from '../common/common.interface';
import { SwaggerTag } from '../common/common.constant';
import { SUPPORTED_FILE_TYPE, MEGABYTE } from '../file/file.constant';
import { DbTransaction } from '../common/common.decorator';
import { FileConfig, UploadedFile } from '../file/file.decorator';
import {
  RawSuccessTimestampDto,
  ReadAllMetadataDto,
} from '../common/common.dto';
import { UploadFileDataDto } from '../file/file.dto';
import { DbTransactionInterceptor } from '../common/common.interceptor';
import { FileInterceptor } from '../file/file.interceptor';
import { CommonService } from '../common/common.service';

import {
  BookingDto,
  UploadNationalIdPhotoBodyDto,
  CreateBookingBodyDto,
  ReadBookingByIdParamDto,
  ReadAllBookingsQueryDto,
  UpdateBookingParamDto,
  UpdateBookingBodyDto,
  DeleteBookingParamDto,
} from './booking.dto';
import { BookingService } from './booking.service';

@Controller('/bookings')
@UseInterceptors(DbTransactionInterceptor)
@ApiTags(SwaggerTag.Booking)
@ApiBearerAuth()
@ApiExtraModels(
  RawSuccessTimestampDto,
  UploadNationalIdPhotoBodyDto,
  UploadFileDataDto,
  ReadAllMetadataDto,
  BookingDto,
)
export class BookingController {
  constructor(
    private readonly commonService: CommonService,
    private readonly bookingService: BookingService,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @SwaggerApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(RawSuccessTimestampDto),
        },
        {
          type: 'object',
          properties: {
            data: {
              $ref: getSchemaPath(BookingDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public create(
    @DbTransaction() transaction: SequelizeTransaction,
    @Body() payload: CreateBookingBodyDto,
  ) {
    return this.bookingService.create(payload, {
      transaction,
    });
  }

  @Post('/uploads/national-id-photo')
  @FileConfig({
    field: 'national_id_photo',
    type: SUPPORTED_FILE_TYPE.image,
    size: 2 * MEGABYTE,
  })
  @UseInterceptors(FileInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      $ref: getSchemaPath(UploadNationalIdPhotoBodyDto),
    },
  })
  @SwaggerApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(RawSuccessTimestampDto),
        },
        {
          type: 'object',
          properties: {
            data: {
              $ref: getSchemaPath(UploadFileDataDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public async uploadNationalIdPhoto(@UploadedFile() file: ApiFile) {
    return this.commonService.successTimestamp<undefined, UploadFileDataDto>({
      data: {
        file_key: file.key,
      },
    });
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(RawSuccessTimestampDto),
        },
        {
          type: 'object',
          properties: {
            metadata: {
              $ref: getSchemaPath(ReadAllMetadataDto),
            },
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(BookingDto),
              },
            },
          },
          required: ['metadata', 'data'],
        },
      ],
    },
  })
  public readAll(
    @DbTransaction() transaction: SequelizeTransaction,
    @Query() queries: ReadAllBookingsQueryDto,
  ) {
    return this.bookingService.readAll(queries, {
      transaction,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(RawSuccessTimestampDto),
        },
        {
          type: 'object',
          properties: {
            data: {
              $ref: getSchemaPath(BookingDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public async readById(
    @DbTransaction() transaction: SequelizeTransaction,
    @Param() params: ReadBookingByIdParamDto,
  ) {
    const existingBooking = await this.bookingService.readById(params.id, {
      transaction,
    });

    if (!existingBooking) {
      throw new UnprocessableEntityException('Booking is not found!');
    }

    return this.commonService.successTimestamp<undefined, BookingDto>({
      data: existingBooking,
    });
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public update(
    @DbTransaction() transaction: SequelizeTransaction,
    @Param() params: UpdateBookingParamDto,
    @Body() payload: UpdateBookingBodyDto,
  ) {
    return this.bookingService.update(params.id, payload, {
      transaction,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public delete(
    @DbTransaction() transaction: SequelizeTransaction,
    @Param() params: DeleteBookingParamDto,
  ) {
    return this.bookingService.delete(params.id, {
      transaction,
    });
  }
}
