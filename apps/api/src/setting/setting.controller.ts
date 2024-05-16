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
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

import { DocumentTag } from '../common/constants/docs.constant';
import { CommonService } from '../common/common.service';

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

@ApiTags(DocumentTag.SETTING)
@ApiBearerAuth(DocumentTag.USER)
@ApiHeader({
  required: true,
  name: 'Authorization',
  description: 'User JWT access token.',
})
@Controller('/settings')
export class SettingController {
  constructor(
    private readonly commonService: CommonService,
    private readonly settingService: SettingService,
  ) {}

  @Post('/countries')
  @HttpCode(HttpStatus.CREATED)
  public createCountry(@Body() payload: CreateCountryBodyDto) {
    return this.settingService.createCountry(payload);
  }

  @Post('/surfboards')
  @HttpCode(HttpStatus.CREATED)
  public createSurfboard(@Body() payload: CreateSurfboardBodyDto) {
    return this.settingService.createSurfboard(payload);
  }

  @Get('/countries')
  @HttpCode(HttpStatus.OK)
  public readAllCountries(@Query() queries: ReadAllCountriesQueryDto) {
    return this.settingService.readAllCountries(queries);
  }

  @Get('/countries/:id')
  @HttpCode(HttpStatus.OK)
  public async readCountryById(@Param() params: ReadCountryByIdParamDto) {
    const existingCountry = await this.settingService.readCountryById(
      params.id,
    );

    if (!existingCountry) {
      throw new UnprocessableEntityException('Country is not found!');
    }

    return this.commonService.successTimestamp({ data: existingCountry });
  }

  @Get('/surfboards')
  @HttpCode(HttpStatus.OK)
  public readAllSurfboards(@Query() queries: ReadAllSurfboardsQueryDto) {
    return this.settingService.readAllSurfboards(queries);
  }

  @Get('/surfboards/:id')
  @HttpCode(HttpStatus.OK)
  public async readSurfboardById(@Param() params: ReadSurfboardByIdParamDto) {
    const existingSurfboard = await this.settingService.readSurfboardById(
      params.id,
    );

    if (!existingSurfboard) {
      throw new UnprocessableEntityException('Surfboard is not found!');
    }

    return this.commonService.successTimestamp({ data: existingSurfboard });
  }

  @Put('/countries/:id')
  @HttpCode(HttpStatus.OK)
  public updateCountry(
    @Param() params: UpdateCountryParamDto,
    @Body() payload: UpdateCountryBodyDto,
  ) {
    return this.settingService.updateCountry(params.id, payload);
  }

  @Put('/surfboards/:id')
  @HttpCode(HttpStatus.OK)
  public updateSurfboard(
    @Param() params: UpdateSurfboardParamDto,
    @Body() payload: UpdateSurfboardBodyDto,
  ) {
    return this.settingService.updateSurfboard(params.id, payload);
  }

  @Delete('/countries/:id')
  @HttpCode(HttpStatus.OK)
  public deleteCountry(@Param() params: DeleteCountryParamDto) {
    return this.settingService.deleteCountry(params.id);
  }

  @Delete('/surfboards/:id')
  @HttpCode(HttpStatus.OK)
  public deleteSurfboard(@Param() params: DeleteSurfboardParamDto) {
    return this.settingService.deleteSurfboard(params.id);
  }
}
