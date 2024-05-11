import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PasswordLength } from '../constants/user-password.constant';

export class UpdateEmailBodyDto {
  @ApiProperty({
    format: 'email',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}

export class UpdatePasswordBodyDto {
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
