import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateUserBodyDto {
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
}
