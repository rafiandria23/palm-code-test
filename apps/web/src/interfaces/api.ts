import type { Dayjs } from 'dayjs';

import type { SortDirection } from '../constants/api';

export interface SuccessTimestamp<MD = undefined, D = undefined> {
  success: boolean;
  timestamp: Dayjs | Date | string;
  metadata: MD;
  data: D;
}

export interface PaginationPayload {
  page?: number;
  page_size?: number;
}

export interface SortPayload<T = unknown> {
  sort?: SortDirection;
  sort_by?: keyof T;
}

export interface ReadAllMetadata {
  total: number;
}
