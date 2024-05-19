import { ApiProperty } from '@nestjs/swagger';

import { CountryDto, SurfboardDto } from '../../setting/dtos';

import { SurfingExperience } from '../constants';

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
    minimum: SurfingExperience.MIN,
    maximum: SurfingExperience.MAX,
    default: SurfingExperience.MIN,
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
