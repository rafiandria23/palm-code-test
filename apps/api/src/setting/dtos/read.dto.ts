import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';

import { PaginationDto, SortDto } from '../../common/dtos/pagination.dto';

import {
  CountrySortProperty,
  SurfboardSortProperty,
} from '../constants/read.constant';

export class ReadCountryByIdParamDto {
  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class ReadAllCountriesQueryDto extends IntersectionType(
  PaginationDto,
  SortDto,
) {
  @ApiProperty()
  @IsEnum(CountrySortProperty)
  @IsString()
  @IsOptional()
  public readonly sort_by: CountrySortProperty = CountrySortProperty.ID;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly code?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly dial_code?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly unicode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly emoji?: string;
}

export class ReadSurfboardByIdParamDto {
  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class ReadAllSurfboardsQueryDto extends IntersectionType(
  PaginationDto,
  SortDto,
) {
  @ApiProperty()
  @IsEnum(SurfboardSortProperty)
  @IsString()
  @IsOptional()
  public readonly sort_by: SurfboardSortProperty = SurfboardSortProperty.ID;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly name?: string;
}
