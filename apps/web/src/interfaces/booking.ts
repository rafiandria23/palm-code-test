import type { Timestamp } from './date';
import type { PaginationPayload, SortPayload } from './api';
import type { Country, Surfboard } from './setting';

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  country_id: string;
  surfing_experience: number;
  date: Timestamp;
  surfboard_id: string;
  national_id_photo_url: string;
  country: Country;
  surfboard: Surfboard;
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at: Timestamp | null;
}

export interface CreateBookingPayload
  extends Pick<
    Booking,
    | 'name'
    | 'email'
    | 'phone'
    | 'country_id'
    | 'surfing_experience'
    | 'date'
    | 'surfboard_id'
  > {
  national_id_photo_file_key: string;
}

export type ReadAllBookingsPayload = PaginationPayload &
  SortPayload<
    Omit<Booking, 'national_id_photo_url' | 'country' | 'surfboard'>
  > &
  Pick<Booking, 'name' | 'email' | 'phone' | 'surfing_experience' | 'date'>;

export type ReadBookingByIdPayload = Pick<Booking, 'id'>;

export type UpdateBookingPayload = Pick<Booking, 'id'> & CreateBookingPayload;

export type DeleteBookingPayload = Pick<Booking, 'id'>;
