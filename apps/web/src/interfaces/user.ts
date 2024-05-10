import type { Dayjs } from 'dayjs';

export interface User {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  created_at: Dayjs | Date | string;
  updated_at: Dayjs | Date | string;
  deleted_at: Dayjs | Date | string | null;
}
