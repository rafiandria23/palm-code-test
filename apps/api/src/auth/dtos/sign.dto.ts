import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
} from 'class-validator';

import { PasswordLength } from '../constants/user-password.constant';

export class SignUpBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly first_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly last_name?: string;

  @ApiProperty({
    format: 'email',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty()
  @MinLength(PasswordLength.MIN)
  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

export class SignInBodyDto extends PickType(SignUpBodyDto, [
  'email',
  'password',
] as const) {}
