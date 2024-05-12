import type { Dayjs } from 'dayjs';

import type { SortDirection } from '../constants/api';

export interface SuccessTimestamp<MD = undefined, D = undefined> {
  success: boolean;
  timestamp: Dayjs | Date | string;
  metadata: MD;
  data: D;
}

export interface PaginationQuery {
  page?: number;
  page_size?: number;
}

export interface SortQuery<T> {
  sort: SortDirection;
  sort_by: keyof T;
}

export interface ReadAllMetadata {
  total: number;
}
