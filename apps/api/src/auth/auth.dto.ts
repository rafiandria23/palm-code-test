import { PickType, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { PasswordLength } from './auth.constant';

export class AuthTokenDataDto {
  @ApiProperty()
  access_token: string;
}

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
    minLength: PasswordLength.Min,
    format: 'password',
  })
  @MinLength(PasswordLength.Min)
  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

export class SignInBodyDto extends PickType(SignUpBodyDto, [
  'email',
  'password',
] as const) {}

export class UpdateEmailBodyDto {
  @ApiProperty({
    format: 'email',
  })
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}

export class UpdatePasswordBodyDto {
  @ApiProperty({
    minLength: PasswordLength.Min,
    format: 'password',
  })
  @MinLength(PasswordLength.Min)
  @IsString()
  @IsNotEmpty()
  public readonly old_password: string;

  @ApiProperty({
    minLength: PasswordLength.Min,
    format: 'password',
  })
  @MinLength(PasswordLength.Min)
  @IsString()
  @IsNotEmpty()
  public readonly new_password: string;
}
