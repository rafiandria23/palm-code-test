import { ApiProperty } from '@nestjs/swagger';

export class CountryDto {
  @ApiProperty({
    format: 'uuid',
  })
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly code: string;

  @ApiProperty()
  public readonly dial_code: string;

  @ApiProperty()
  public readonly emoji: string;

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

export class SurfboardDto {
  @ApiProperty({
    format: 'uuid',
  })
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

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
