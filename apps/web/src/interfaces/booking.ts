import type { Timestamp } from './date';
import type { PaginationPayload, SortPayload } from './api';
import type { Country, Surfboard } from './setting';

export interface Booking {
  id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string;
  visitor_country_id: string;
  visitor_experience: number;
  visit_date: Timestamp;
  surfboard_id: string;
  national_id_photo_url: string;
  visitor_country: Country;
  surfboard: Surfboard;
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at: Timestamp | null;
}

export interface CreateBookingPayload
  extends Pick<
    Booking,
    | 'visitor_name'
    | 'visitor_email'
    | 'visitor_phone'
    | 'visitor_country_id'
    | 'visitor_experience'
    | 'visit_date'
    | 'surfboard_id'
  > {
  national_id_photo: string;
}

export type ReadAllBookingsPayload = PaginationPayload &
  SortPayload<
    Omit<Booking, 'national_id_photo_url' | 'visitor_country' | 'surfboard'>
  > &
  Pick<
    Booking,
    | 'visitor_name'
    | 'visitor_email'
    | 'visitor_phone'
    | 'visitor_experience'
    | 'visit_date'
  >;

export type ReadBookingByIdPayload = Pick<Booking, 'id'>;

export type UpdateBookingPayload = Pick<Booking, 'id'> & CreateBookingPayload;

export type DeleteBookingPayload = Pick<Booking, 'id'>;
