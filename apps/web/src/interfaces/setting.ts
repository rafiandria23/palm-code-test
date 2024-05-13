import type { Dayjs } from 'dayjs';

export interface Country {
  id: string;
  name: string;
  code: string;
  dial_code: string;
  emoji: string;
  created_at: Dayjs | Date | string;
  updated_at: Dayjs | Date | string;
  deleted_at: Dayjs | Date | string | null;
}

export interface Surfboard {
  id: string;
  name: string;
  created_at: Dayjs | Date | string;
  updated_at: Dayjs | Date | string;
  deleted_at: Dayjs | Date | string | null;
}
