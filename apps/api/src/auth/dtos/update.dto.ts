import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PasswordLength } from '../constants';

export class UpdatePasswordDto {
  @ApiProperty()
  @MinLength(PasswordLength.MIN)
  @IsString()
  @IsNotEmpty()
  public readonly old_password: string;

  @ApiProperty()
  @MinLength(PasswordLength.MIN)
  @IsString()
  @IsNotEmpty()
  public readonly new_password: string;
}
