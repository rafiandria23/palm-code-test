import type { Dayjs } from 'dayjs';

export interface SuccessTimestamp<MD = undefined, D = undefined> {
  success: boolean;
  timestamp: Dayjs | Date | string;
  metadata: MD;
  data: D;
}
