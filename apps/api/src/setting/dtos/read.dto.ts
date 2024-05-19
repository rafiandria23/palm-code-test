import { IntersectionType, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';

import {
  PaginationQueryDto,
  SortQueryDto,
} from '../../common/dtos/pagination.dto';

import {
  CountrySortProperty,
  SurfboardSortProperty,
} from '../constants/read.constant';

export class ReadAllCountriesQueryDto extends IntersectionType(
  PaginationQueryDto,
  SortQueryDto,
) {
  @ApiProperty({
    required: false,
    enum: CountrySortProperty,
  })
  @IsEnum(CountrySortProperty)
  @IsString()
  @IsOptional()
  public readonly sort_by?: CountrySortProperty = CountrySortProperty.NAME;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly code?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly dial_code?: string;
}

export class ReadCountryByIdParamDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class ReadAllSurfboardsQueryDto extends IntersectionType(
  PaginationQueryDto,
  SortQueryDto,
) {
  @ApiProperty({
    required: false,
    enum: SurfboardSortProperty,
  })
  @IsEnum(SurfboardSortProperty)
  @IsString()
  @IsOptional()
  public readonly sort_by?: SurfboardSortProperty = SurfboardSortProperty.NAME;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly name?: string;
}

export class ReadSurfboardByIdParamDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}
