import {
  IntersectionType,
  PickType,
  OmitType,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { PaginationQueryDto, SortQueryDto } from '../common/common.dto';

import { UserSortProperty } from './user.constant';

export class UserDto {
  @ApiProperty({
    format: 'uuid',
  })
  public readonly id: string;

  @ApiProperty()
  public readonly first_name: string;

  @ApiProperty({
    nullable: true,
    default: null,
  })
  public readonly last_name: string | null;

  @ApiProperty({
    format: 'email',
  })
  public readonly email: string;

  @ApiProperty({
    format: 'date-time',
  })
  public readonly created_at: Date;

  @ApiProperty({
    format: 'date-time',
  })
  public readonly updated_at: Date;

  @ApiProperty({
    nullable: true,
    format: 'date-time',
    default: null,
  })
  public readonly deleted_at: Date | null;
}

export class CreateUserBodyDto {
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
}

export class ReadAllUsersQueryDto extends IntersectionType(
  PaginationQueryDto,
  SortQueryDto,
) {
  @ApiProperty({
    required: false,
    enum: UserSortProperty,
  })
  @IsEnum(UserSortProperty)
  @IsString()
  @IsOptional()
  public readonly sort_by?: UserSortProperty = UserSortProperty.FirstName;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly first_name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly last_name?: string;

  @ApiProperty({
    required: false,
    format: 'email',
  })
  @IsString()
  @IsOptional()
  public readonly email?: string;
}

export class ReadUserByIdParamDto {
  @ApiProperty({
    format: 'uuid',
  })
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class UpdateUserEmailBodyDto extends PickType(CreateUserBodyDto, [
  'email',
] as const) {}

export class UpdateUserBodyDto extends OmitType(CreateUserBodyDto, [
  'email',
] as const) {}
