import { PickType, ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Dayjs } from 'dayjs';

import {
  RADIX,
  PaginationPage,
  PaginationSize,
  SortDirection,
} from './common.constant';

export class ReadAllMetadataDto {
  @ApiProperty()
  public readonly total: number;
}

export class PaginationQueryDto {
  @ApiProperty({
    required: false,
    minimum: PaginationPage.Min,
    default: PaginationPage.Min,
  })
  @Transform(({ value }) => parseInt(value, RADIX))
  @Min(PaginationPage.Min)
  @IsNumber()
  @IsOptional()
  public readonly page?: number = PaginationPage.Min;

  @ApiProperty({
    required: false,
    minimum: PaginationSize.Min,
    maximum: PaginationSize.Max,
    default: PaginationSize.Default,
  })
  @Transform(({ value }) => parseInt(value, RADIX))
  @Max(PaginationSize.Max)
  @Min(PaginationSize.Min)
  @IsNumber()
  @IsOptional()
  public readonly page_size?: number = PaginationSize.Default;
}

export class SortQueryDto {
  @ApiProperty({
    required: false,
    enum: SortDirection,
  })
  @IsEnum(SortDirection)
  @IsString()
  @IsOptional()
  public readonly sort?: SortDirection = SortDirection.Asc;
}

export class SuccessTimestampDto<MD = undefined, D = undefined> {
  @ApiProperty()
  public readonly success: boolean;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  public readonly timestamp: Dayjs;

  @ApiProperty()
  public readonly metadata: MD = undefined;

  @ApiProperty()
  public readonly data: D = undefined;
}

export class RawSuccessTimestampDto extends PickType(SuccessTimestampDto, [
  'success',
  'timestamp',
] as const) {}
