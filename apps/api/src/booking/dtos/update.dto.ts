import { IntersectionType, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { CreateBookingBodyDto } from './create.dto';

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
