import { PickType, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { PasswordLength } from '../constants/user-password.constant';

export class SignUpBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly first_name: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly last_name?: string;

  @ApiProperty({
    format: 'email',
  })
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty({
    minLength: PasswordLength.MIN,
    format: 'password',
  })
  @MinLength(PasswordLength.MIN)
  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

export class SignInBodyDto extends PickType(SignUpBodyDto, [
  'email',
  'password',
] as const) {}
