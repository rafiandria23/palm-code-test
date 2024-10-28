import { IntersectionType, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
} from 'class-validator';

import { PaginationQueryDto, SortQueryDto } from '../common/common.dto';

import { CountrySortProperty, SurfboardSortProperty } from './setting.constant';

export class CountryDto {
  @ApiProperty({
    format: 'uuid',
  })
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly code: string;

  @ApiProperty()
  public readonly dial_code: string;

  @ApiProperty()
  public readonly emoji: string;

  @ApiProperty({
    format: 'date-time',
  })
  public readonly created_at: Date;

  @ApiProperty({
    format: 'date-time',
  })
  public readonly updated_at: Date;

  @ApiProperty({
    nullable: true,
    format: 'date-time',
    default: null,
  })
  public readonly deleted_at: Date | null;
}

export class SurfboardDto {
  @ApiProperty({
    format: 'uuid',
  })
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty({
    format: 'date-time',
  })
  public readonly created_at: Date;

  @ApiProperty({
    format: 'date-time',
  })
  public readonly updated_at: Date;

  @ApiProperty({
    nullable: true,
    format: 'date-time',
    default: null,
  })
  public readonly deleted_at: Date | null;
}

export class CreateCountryBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly dial_code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly emoji: string;
}

export class CreateSurfboardBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly name: string;
}

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
  public readonly sort_by?: CountrySortProperty = CountrySortProperty.Name;

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
  public readonly sort_by?: SurfboardSortProperty = SurfboardSortProperty.Name;

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

export class UpdateCountryParamDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class UpdateCountryBodyDto extends IntersectionType(
  CreateCountryBodyDto,
) {}

export class UpdateSurfboardParamDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class UpdateSurfboardBodyDto extends IntersectionType(
  CreateSurfboardBodyDto,
) {}

export class DeleteCountryParamDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class DeleteSurfboardParamDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}
