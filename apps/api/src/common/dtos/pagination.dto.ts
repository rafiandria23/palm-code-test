import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

import {
  RADIX,
  PaginationPage,
  PaginationSize,
  SortDirection,
} from '../constants';

export class PaginationDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value, RADIX))
  @Min(PaginationPage.MIN)
  @IsNumber()
  @IsOptional()
  page = PaginationPage.MIN;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, RADIX))
  @Max(PaginationSize.MAX)
  @Min(PaginationSize.MIN)
  @IsNumber()
  @IsOptional()
  page_size = PaginationSize.DEFAULT;
}

export class PaginationSortDto {
  @ApiProperty()
  @IsEnum(SortDirection)
  @IsString()
  @IsOptional()
  sort: SortDirection = SortDirection.ASC;
}
