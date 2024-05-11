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

export class ReadBookingByIdParamDto {
  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class ReadAllBookingsQueryDto extends IntersectionType(
  PaginationQueryDto,
  SortQueryDto,
) {
  @ApiProperty()
  @IsEnum(BookingSortProperty)
  @IsString()
  @IsOptional()
  public readonly sort_by: BookingSortProperty = BookingSortProperty.ID;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly visitor_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly visitor_email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly visitor_phone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly surfing_experience?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly visit_date?: string;
}
