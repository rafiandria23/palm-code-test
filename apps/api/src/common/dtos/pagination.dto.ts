import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { RADIX } from '../constants/number.constant';
import {
  PaginationPage,
  PaginationSize,
  SortDirection,
} from '../constants/pagination.constant';

export class PaginationQueryDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value, RADIX))
  @Min(PaginationPage.MIN)
  @IsNumber()
  @IsOptional()
  public readonly page = PaginationPage.MIN;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, RADIX))
  @Max(PaginationSize.MAX)
  @Min(PaginationSize.MIN)
  @IsNumber()
  @IsOptional()
  public readonly page_size = PaginationSize.DEFAULT;
}

export class SortQueryDto {
  @ApiProperty()
  @IsEnum(SortDirection)
  @IsString()
  @IsOptional()
  public readonly sort: SortDirection = SortDirection.ASC;
}
