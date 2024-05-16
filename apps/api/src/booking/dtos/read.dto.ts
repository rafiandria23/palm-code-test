import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
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

import { BookingSortProperty } from '../constants/read.constant';

export class ReadAllBookingsQueryDto extends IntersectionType(
  PaginationQueryDto,
  SortQueryDto,
) {
  @ApiProperty()
  @IsEnum(BookingSortProperty)
  @IsString()
  @IsOptional()
  public readonly sort_by?: BookingSortProperty =
    BookingSortProperty.CREATED_AT;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly phone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly surfing_experience?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly date?: string;
}

export class ReadBookingByIdParamDto {
  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}
