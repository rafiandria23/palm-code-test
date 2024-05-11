import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly dial_code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly unicode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly emoji: string;
}

export class CreateSurfboardBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly name: string;
}
