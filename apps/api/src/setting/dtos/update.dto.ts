import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { CreateCountryBodyDto, CreateSurfboardBodyDto } from './create.dto';

export class UpdateCountryParamDto {
  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class UpdateCountryBodyDto extends IntersectionType(
  CreateCountryBodyDto,
) {}

export class UpdateSurfboardParamDto {
  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly id: string;
}

export class UpdateSurfboardBodyDto extends IntersectionType(
  CreateSurfboardBodyDto,
) {}
