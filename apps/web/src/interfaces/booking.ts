import type { Dayjs } from 'dayjs';

import type { Country } from './country';
import type { Surfboard } from './surfboard';

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
  country: Country;
  surfboard: Surfboard;
  created_at: Dayjs | Date | string;
  updated_at: Dayjs | Date | string;
  deleted_at: Dayjs | Date | string | null;
}

export interface BookingForm
  extends Omit<
    Booking,
    'id' | 'national_id_photo_url' | 'created_at' | 'updated_at' | 'deleted_at'
  > {
  national_id_photo: string;
}
