import { PickType, ApiProperty } from '@nestjs/swagger';
import { Dayjs } from 'dayjs';

export class SuccessTimestampDto<MD = undefined, D = undefined> {
  @ApiProperty()
  public readonly success: boolean;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  public readonly timestamp: Dayjs;

  @ApiProperty()
  public readonly metadata: MD = undefined;

  @ApiProperty()
  public readonly data: D = undefined;
}

export class RawSuccessTimestampDto extends PickType(SuccessTimestampDto, [
  'success',
  'timestamp',
] as const) {}
