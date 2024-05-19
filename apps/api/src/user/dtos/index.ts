import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    format: 'uuid',
  })
  public readonly id: string;

  @ApiProperty()
  public readonly first_name: string;

  @ApiProperty({
    nullable: true,
    default: null,
  })
  public readonly last_name: string | null;

  @ApiProperty({
    format: 'email',
  })
  public readonly email: string;

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
