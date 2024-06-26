import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { SurfingExperience } from '../constants';

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
    minimum: SurfingExperience.MIN,
    maximum: SurfingExperience.MAX,
    default: SurfingExperience.MIN,
  })
  @Max(SurfingExperience.MAX)
  @Min(SurfingExperience.MIN)
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
