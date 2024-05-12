import type { Dayjs } from 'dayjs';

import type { Country, Surfboard } from './setting';

export interface Booking {
  id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string;
  visitor_country_id: string;
  visitor_experience: number;
  visit_date: Dayjs | Date | string;
  surfboard_id: string;
  national_id_photo_url: string;
  visitor_country: Country;
  surfboard: Surfboard;
  created_at: Dayjs | Date | string;
  updated_at: Dayjs | Date | string;
  deleted_at: Dayjs | Date | string | null;
}

export interface BookingFormPayload
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
