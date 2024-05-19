import { IntersectionType, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { RADIX } from '../../common/constants/number.constant';
import {
  PaginationQueryDto,
  SortQueryDto,
} from '../../common/dtos/pagination.dto';

import { SurfingExperience } from '../constants';
import { BookingSortProperty } from '../constants/read.constant';

export class ReadAllBookingsQueryDto extends IntersectionType(
  PaginationQueryDto,
  SortQueryDto,
) {
  @ApiProperty({
    required: false,
    enum: BookingSortProperty,
  })
  @IsEnum(BookingSortProperty)
  @IsString()
  @IsOptional()
  public readonly sort_by?: BookingSortProperty =
    BookingSortProperty.CREATED_AT;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly name?: string;

  @ApiProperty({
    required: false,
    format: 'email',
  })
  @IsString()
  @IsOptional()
  public readonly email?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly phone?: string;

  @ApiProperty({
    required: false,
    minimum: SurfingExperience.MIN,
    maximum: SurfingExperience.MAX,
    default: SurfingExperience.MIN,
  })
  @Transform(({ value }) => parseInt(value, RADIX))
  @Max(SurfingExperience.MAX)
  @Min(SurfingExperience.MIN)
  @IsNumber()
  @IsOptional()
  public readonly surfing_experience?: number;

  @ApiProperty({
    required: false,
    format: 'date',
  })
  @IsString()
  @IsOptional()
  public readonly date?: string;
}

export class ReadBookingByIdParamDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}
