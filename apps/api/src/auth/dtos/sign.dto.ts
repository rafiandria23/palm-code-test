import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { CreateUserDto } from '../../user/dtos';

import { PasswordLength } from '../constants';

export class SignUpDto extends IntersectionType(CreateUserDto) {
  @ApiProperty()
  @MinLength(PasswordLength.MIN)
  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

export class SignInDto extends PickType(SignUpDto, [
  'email',
  'password',
] as const) {}
