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
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Transaction as SequelizeTransaction } from 'sequelize';

import { DocumentTag } from '../common/constants/docs.constant';
import { Transaction } from '../common/decorators/transaction.decorator';
import { RawSuccessTimestampDto } from '../common/dtos/success-timestamp.dto';
import { ReadAllMetadataDto } from '../common/dtos/pagination.dto';
import { TransactionInterceptor } from '../common/interceptors/transaction.interceptor';
import { CommonService } from '../common/common.service';

import { CountryDto, SurfboardDto } from './dtos';
import {
  CreateCountryBodyDto,
  CreateSurfboardBodyDto,
} from './dtos/create.dto';
import {
  ReadCountryByIdParamDto,
  ReadAllCountriesQueryDto,
  ReadSurfboardByIdParamDto,
  ReadAllSurfboardsQueryDto,
} from './dtos/read.dto';
import {
  UpdateCountryParamDto,
  UpdateCountryBodyDto,
  UpdateSurfboardParamDto,
  UpdateSurfboardBodyDto,
} from './dtos/update.dto';
import {
  DeleteCountryParamDto,
  DeleteSurfboardParamDto,
} from './dtos/delete.dto';
import { SettingService } from './setting.service';

@Controller('/settings')
@UseInterceptors(TransactionInterceptor)
@ApiTags(DocumentTag.SETTING)
@ApiBearerAuth()
@ApiExtraModels(
  RawSuccessTimestampDto,
  ReadAllMetadataDto,
  CountryDto,
  SurfboardDto,
)
export class SettingController {
  constructor(
    private readonly commonService: CommonService,
    private readonly settingService: SettingService,
  ) {}

  @Post('/countries')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
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
              $ref: getSchemaPath(CountryDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public createCountry(
    @Transaction() transaction: SequelizeTransaction,
    @Body() payload: CreateCountryBodyDto,
  ) {
    return this.settingService.createCountry(payload, {
      transaction,
    });
  }

  @Post('/surfboards')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
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
              $ref: getSchemaPath(SurfboardDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public createSurfboard(
    @Transaction() transaction: SequelizeTransaction,
    @Body() payload: CreateSurfboardBodyDto,
  ) {
    return this.settingService.createSurfboard(payload, {
      transaction,
    });
  }

  @Get('/countries')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
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
                $ref: getSchemaPath(CountryDto),
              },
            },
          },
          required: ['metadata', 'data'],
        },
      ],
    },
  })
  public readAllCountries(
    @Transaction() transaction: SequelizeTransaction,
    @Query() queries: ReadAllCountriesQueryDto,
  ) {
    return this.settingService.readAllCountries(queries, {
      transaction,
    });
  }

  @Get('/countries/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
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
              $ref: getSchemaPath(CountryDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public async readCountryById(
    @Transaction() transaction: SequelizeTransaction,
    @Param() params: ReadCountryByIdParamDto,
  ) {
    const existingCountry = await this.settingService.readCountryById(
      params.id,
      {
        transaction,
      },
    );

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country is not found!');
    }

    return this.commonService.successTimestamp<undefined, CountryDto>({
      data: existingCountry,
    });
  }

  @Get('/surfboards')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
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
                $ref: getSchemaPath(SurfboardDto),
              },
            },
          },
          required: ['metadata', 'data'],
        },
      ],
    },
  })
  public readAllSurfboards(
    @Transaction() transaction: SequelizeTransaction,
    @Query() queries: ReadAllSurfboardsQueryDto,
  ) {
    return this.settingService.readAllSurfboards(queries, {
      transaction,
    });
  }

  @Get('/surfboards/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
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
              $ref: getSchemaPath(SurfboardDto),
            },
          },
          required: ['data'],
        },
      ],
    },
  })
  public async readSurfboardById(
    @Transaction() transaction: SequelizeTransaction,
    @Param() params: ReadSurfboardByIdParamDto,
  ) {
    const existingSurfboard = await this.settingService.readSurfboardById(
      params.id,
      {
        transaction,
      },
    );

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard is not found!');
    }

    return this.commonService.successTimestamp<undefined, SurfboardDto>({
      data: existingSurfboard,
    });
  }

  @Put('/countries/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public updateCountry(
    @Transaction() transaction: SequelizeTransaction,
    @Param() params: UpdateCountryParamDto,
    @Body() payload: UpdateCountryBodyDto,
  ) {
    return this.settingService.updateCountry(params.id, payload, {
      transaction,
    });
  }

  @Put('/surfboards/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public updateSurfboard(
    @Transaction() transaction: SequelizeTransaction,
    @Param() params: UpdateSurfboardParamDto,
    @Body() payload: UpdateSurfboardBodyDto,
  ) {
    return this.settingService.updateSurfboard(params.id, payload, {
      transaction,
    });
  }

  @Delete('/countries/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public deleteCountry(
    @Transaction() transaction: SequelizeTransaction,
    @Param() params: DeleteCountryParamDto,
  ) {
    return this.settingService.deleteCountry(params.id, {
      transaction,
    });
  }

  @Delete('/surfboards/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public deleteSurfboard(
    @Transaction() transaction: SequelizeTransaction,
    @Param() params: DeleteSurfboardParamDto,
  ) {
    return this.settingService.deleteSurfboard(params.id, { transaction });
  }
}
