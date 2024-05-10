import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

import { DocumentTag } from '../common/constants/docs.constant';

import {
  ReadCountryByIdParamDto,
  ReadAllCountriesQueryDto,
  ReadSurfboardByIdParamDto,
  ReadAllSurfboardsQueryDto,
} from './dtos/read.dto';
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
  constructor(private readonly settingService: SettingService) {}

  @Get('/countries/:id')
  @HttpCode(HttpStatus.OK)
  public readCountryById(@Param() params: ReadCountryByIdParamDto) {
    return this.settingService.readCountryById(params.id);
  }

  @Get('/countries')
  @HttpCode(HttpStatus.OK)
  public readAllCountries(@Query() queries: ReadAllCountriesQueryDto) {
    return this.settingService.readAllCountries(queries);
  }

  @Get('/surfboards/:id')
  @HttpCode(HttpStatus.OK)
  public readSurfboardById(@Param() params: ReadSurfboardByIdParamDto) {
    return this.settingService.readSurfboardById(params.id);
  }

  @Get('/surfboards')
  @HttpCode(HttpStatus.OK)
  public readAllSurfboards(@Query() queries: ReadAllSurfboardsQueryDto) {
    return this.settingService.readAllSurfboards(queries);
  }
}
