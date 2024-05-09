import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
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
  public readonly page = PaginationPage.MIN;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, RADIX))
  @Max(PaginationSize.MAX)
  @Min(PaginationSize.MIN)
  @IsNumber()
  @IsOptional()
  public readonly page_size = PaginationSize.DEFAULT;
}

export class SortDto {
  @ApiProperty()
  @IsEnum(SortDirection)
  @IsString()
  @IsOptional()
  public readonly sort: SortDirection = SortDirection.ASC;
}
