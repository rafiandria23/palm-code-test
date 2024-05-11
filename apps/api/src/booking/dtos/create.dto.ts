import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateBookingBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly visitor_name: string;

  @ApiProperty({
    format: 'email',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly visitor_email: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  public readonly visitor_phone: string;

  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly visitor_country_id: string;

  @ApiProperty()
  @Max(10)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  public readonly surfing_experience: number;

  @ApiProperty()
  @MaxLength(10)
  @MinLength(10)
  @IsDateString()
  @IsString()
  @IsNotEmpty()
  public readonly visit_date: string;

  @ApiProperty()
  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  public readonly surfboard_id: string;
}
