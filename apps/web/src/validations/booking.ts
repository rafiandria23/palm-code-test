import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
} from 'class-validator';

import { IsDate } from './date';

export class CreateBookingFormPayload {
  @IsString({ message: 'Name is invalid!' })
  @IsNotEmpty({ message: 'Name must not be empty!' })
  public name: string;

  @IsEmail(undefined, { message: 'Email is invalid!' })
  @IsString({ message: 'Email is invalid!' })
  @IsNotEmpty({ message: 'Email must not be empty!' })
  public email: string;

  @IsPhoneNumber(undefined, { message: 'Phone is invalid!' })
  @IsString({ message: 'Phone is invalid!' })
  @IsNotEmpty({ message: 'Phone must not be empty!' })
  public phone: string;

  @IsUUID('4', { message: 'Country is invalid!' })
  @IsString({ message: 'Country is invalid!' })
  @IsNotEmpty({ message: 'Country must not be empty!' })
  public country_id: string;

  @Max(10, { message: 'Surfing experience must not exceed 10!' })
  @Min(0, { message: 'Surfing experience must be at least 0!' })
  @IsNumber(undefined, { message: 'Surfing experience is invalid!' })
  @IsNotEmpty({ message: 'Surfing experience must not be empty!' })
  public surfing_experience: number;

  @IsDate({ message: 'Date is invalid!' })
  @IsString({ message: 'Date is invalid!' })
  @IsNotEmpty({ message: 'Date must not be empty!' })
  public date: string;

  @IsUUID('4', { message: 'Surfboard is invalid!' })
  @IsString({ message: 'Surfboard is invalid!' })
  @IsNotEmpty({ message: 'Surfboard must not be empty!' })
  public surfboard_id: string;
}
