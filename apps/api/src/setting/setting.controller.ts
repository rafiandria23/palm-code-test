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
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { DocumentTag } from '../common/constants/docs.constant';
import { RawSuccessTimestampDto } from '../common/dtos/success-timestamp.dto';
import { ReadAllMetadataDto } from '../common/dtos/pagination.dto';
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
  public createCountry(@Body() payload: CreateCountryBodyDto) {
    return this.settingService.createCountry(payload);
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
  public createSurfboard(@Body() payload: CreateSurfboardBodyDto) {
    return this.settingService.createSurfboard(payload);
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
  public readAllCountries(@Query() queries: ReadAllCountriesQueryDto) {
    return this.settingService.readAllCountries(queries);
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
  public async readCountryById(@Param() params: ReadCountryByIdParamDto) {
    const existingCountry = await this.settingService.readCountryById(
      params.id,
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
  public readAllSurfboards(@Query() queries: ReadAllSurfboardsQueryDto) {
    return this.settingService.readAllSurfboards(queries);
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
  public async readSurfboardById(@Param() params: ReadSurfboardByIdParamDto) {
    const existingSurfboard = await this.settingService.readSurfboardById(
      params.id,
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
    @Param() params: UpdateCountryParamDto,
    @Body() payload: UpdateCountryBodyDto,
  ) {
    return this.settingService.updateCountry(params.id, payload);
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
    @Param() params: UpdateSurfboardParamDto,
    @Body() payload: UpdateSurfboardBodyDto,
  ) {
    return this.settingService.updateSurfboard(params.id, payload);
  }

  @Delete('/countries/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public deleteCountry(@Param() params: DeleteCountryParamDto) {
    return this.settingService.deleteCountry(params.id);
  }

  @Delete('/surfboards/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(RawSuccessTimestampDto),
    },
  })
  public deleteSurfboard(@Param() params: DeleteSurfboardParamDto) {
    return this.settingService.deleteSurfboard(params.id);
  }
}
