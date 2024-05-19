import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Response,
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

import { ApiResponse } from '../common/interfaces/api.interface';
import { DocumentTag } from '../common/constants/docs.constant';
import {
  SUPPORTED_FILE_TYPE,
  MEGABYTE,
} from '../common/constants/file.constant';
import { RawSuccessTimestampDto } from '../common/dtos/success-timestamp.dto';
import { UploadFileDataDto } from '../common/dtos/file.dto';
import { FileConfig } from '../common/decorators/file.decorator';
import { ReadAllMetadataDto } from '../common/dtos/pagination.dto';
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
  public create(@Body() payload: CreateBookingBodyDto) {
    return this.bookingService.create(payload);
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
  public async uploadNationalIdPhoto(@Response() response: ApiResponse) {
    return response.send(
      this.commonService.successTimestamp<undefined, UploadFileDataDto>({
        data: {
          file_key: response.file.key,
        },
      }),
    );
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
  public readAll(@Query() queries: ReadAllBookingsQueryDto) {
    return this.bookingService.readAll(queries);
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
  public async readById(@Param() params: ReadBookingByIdParamDto) {
    const existingBooking = await this.bookingService.readById(params.id);

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
    @Param() params: UpdateBookingParamDto,
    @Body() payload: UpdateBookingBodyDto,
  ) {
    return this.bookingService.update(params.id, payload);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public delete(@Param() params: DeleteBookingParamDto) {
    return this.bookingService.delete(params.id);
  }
}
