import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { CreateUserDto } from '../../user/dtos';

export class SignUpDto extends CreateUserDto {
  @ApiProperty()
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

export class SignInDto extends PickType(SignUpDto, [
  'email',
  'password',
] as const) {}
