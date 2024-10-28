import { IntersectionType, ApiProperty } from '@nestjs/swagger';
import { MultipartFile } from '@fastify/multipart';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
  IsDateString,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { RADIX } from '../common/common.constant';
import { PaginationQueryDto, SortQueryDto } from '../common/common.dto';
import { CountryDto, SurfboardDto } from '../setting/setting.dto';

import { SurfingExperience, BookingSortProperty } from './booking.constant';

export class BookingDto {
  @ApiProperty({
    format: 'uuid',
  })
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty({
    format: 'email',
  })
  public readonly email: string;

  @ApiProperty()
  public readonly phone: string;

  @ApiProperty({
    format: 'uuid',
  })
  public readonly country_id: string;

  @ApiProperty({
    minimum: SurfingExperience.Min,
    maximum: SurfingExperience.Max,
    default: SurfingExperience.Min,
  })
  public readonly surfing_experience: number;

  @ApiProperty({
    format: 'date',
  })
  public readonly date: string;

  @ApiProperty({
    format: 'uuid',
  })
  public readonly surfboard_id: string;

  @ApiProperty()
  public readonly national_id_photo_url: string;

  @ApiProperty()
  public readonly country: CountryDto;

  @ApiProperty()
  public readonly surfboard: SurfboardDto;

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

export class UploadNationalIdPhotoBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  national_id_photo: MultipartFile;
}

export class CreateBookingBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty({
    format: 'email',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  public readonly phone: string;

  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly country_id: string;

  @ApiProperty({
    minimum: SurfingExperience.Min,
    maximum: SurfingExperience.Max,
    default: SurfingExperience.Min,
  })
  @Max(SurfingExperience.Max)
  @Min(SurfingExperience.Min)
  @IsNumber()
  @IsNotEmpty()
  public readonly surfing_experience: number;

  @ApiProperty({
    format: 'date',
  })
  @MaxLength(10)
  @MinLength(10)
  @IsDateString()
  @IsString()
  @IsNotEmpty()
  public readonly date: string;

  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly surfboard_id: string;

  @ApiProperty()
  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  @IsNotEmpty()
  public readonly national_id_photo_file_key: string;
}

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
  public readonly sort_by?: BookingSortProperty = BookingSortProperty.CreatedAt;

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
    minimum: SurfingExperience.Min,
    maximum: SurfingExperience.Max,
    default: SurfingExperience.Min,
  })
  @Transform(({ value }) => parseInt(value, RADIX))
  @Max(SurfingExperience.Max)
  @Min(SurfingExperience.Min)
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

export class UpdateBookingParamDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class UpdateBookingBodyDto extends IntersectionType(
  CreateBookingBodyDto,
) {}

export class DeleteBookingParamDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}
