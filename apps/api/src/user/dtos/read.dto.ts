import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';

import { PaginationDto, SortDto } from '../../common';

import { UserSortProperty } from '../constants';

export class ReadUserByIdParamDto {
  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class ReadAllUsersQueryDto extends IntersectionType(
  PaginationDto,
  SortDto,
) {
  @ApiProperty()
  @IsEnum(UserSortProperty)
  @IsString()
  @IsOptional()
  public readonly sort_by: UserSortProperty = UserSortProperty.ID;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly first_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly last_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public readonly email?: string;
}
