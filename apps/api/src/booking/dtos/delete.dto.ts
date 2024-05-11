import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteBookingParamDto {
  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}
