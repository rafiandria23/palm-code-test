import type { Timestamp } from './date';
import type { PaginationPayload, SortPayload } from './api';

export interface Country {
  id: string;

  name: string;
  code: string;
  dial_code: string;
  emoji: string;

  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at: Timestamp | null;
}

export interface Surfboard {
  id: string;

  name: string;

  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at: Timestamp | null;
}

export type CreateCountryPayload = Pick<
  Country,
  'name' | 'code' | 'dial_code' | 'emoji'
>;

export type CreateSurfboardPayload = Pick<Surfboard, 'name'>;

export type ReadAllCountriesPayload = PaginationPayload &
  SortPayload<Omit<Country, 'emoji'>> &
  Partial<Pick<Country, 'name' | 'code' | 'dial_code'>>;

export type ReadCountryByIdPayload = Pick<Country, 'id'>;

export type ReadAllSurfboardsPayload = PaginationPayload &
  SortPayload<Surfboard> &
  Partial<Pick<Surfboard, 'name'>>;

export type ReadSurfboardByIdPayload = Pick<Surfboard, 'id'>;

export type UpdateCountryPayload = Pick<Country, 'id'> & CreateCountryPayload;

export type UpdateSurfboardPayload = Pick<Surfboard, 'id'> &
  CreateSurfboardPayload;

export type DeleteCountryPayload = Pick<Country, 'id'>;

export type DeleteSurfboardPayload = Pick<Surfboard, 'id'>;
