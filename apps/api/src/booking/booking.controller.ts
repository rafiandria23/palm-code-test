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

import { ApiFile } from '../common/interfaces/api.interface';
import { DocumentTag } from '../common/constants/docs.constant';
import {
  SUPPORTED_FILE_TYPE,
  MEGABYTE,
} from '../common/constants/file.constant';
import { Transaction } from '../common/decorators/transaction.decorator';
import { FileConfig, UploadedFile } from '../common/decorators/file.decorator';
import { RawSuccessTimestampDto } from '../common/dtos/success-timestamp.dto';
import { UploadFileDataDto } from '../common/dtos/file.dto';
import { ReadAllMetadataDto } from '../common/dtos/pagination.dto';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { FileInterceptor } from '../common/interceptors/file.interceptor';
import { CommonService } from '../common/common.service';

import { BookingDto } from './dtos';
import { UploadNationalIdPhotoBodyDto } from './dtos/file.dto';
import { CreateBookingBodyDto } from './dtos/create.dto';
import {
  ReadBookingByIdParamDto,
  ReadAllBookingsQueryDto,
} from './dtos/read.dto';
import { UpdateBookingParamDto, UpdateBookingBodyDto } from './dtos/update.dto';
import { DeleteBookingParamDto } from './dtos/delete.dto';
import { BookingService } from './booking.service';

@Controller('/bookings')
@UseInterceptors(TransactionInterceptor)
@ApiTags(DocumentTag.BOOKING)
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
    @Transaction() transaction: SequelizeTransaction,
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
    @Transaction() transaction: SequelizeTransaction,
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
    @Transaction() transaction: SequelizeTransaction,
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
    @Transaction() transaction: SequelizeTransaction,
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
    @Transaction() transaction: SequelizeTransaction,
    @Param() params: DeleteBookingParamDto,
  ) {
    return this.bookingService.delete(params.id, {
      transaction,
    });
  }
}
