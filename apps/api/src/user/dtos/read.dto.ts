import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';

import {
  PaginationQueryDto,
  SortQueryDto,
} from '../../common/dtos/pagination.dto';

import { UserSortProperty } from '../constants/read.constant';

export class ReadAllUsersQueryDto extends IntersectionType(
  PaginationQueryDto,
  SortQueryDto,
) {
  @ApiProperty()
  @IsEnum(UserSortProperty)
  @IsString()
  @IsOptional()
  public readonly sort_by?: UserSortProperty = UserSortProperty.FIRST_NAME;

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

export class ReadUserByIdParamDto {
  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}
