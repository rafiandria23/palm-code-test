import type { Timestamp } from './date';
import { PaginationPayload, SortPayload } from './api';

export interface User {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at: Timestamp | null;
}

export type ReadAllUsersPayload = PaginationPayload &
  SortPayload<User> &
  Partial<Pick<User, 'first_name' | 'last_name' | 'email'>>;

export type ReadUserByIdPayload = Pick<User, 'id'>;

export type UpdateUserPayload = Pick<
  User,
  'id' | 'first_name' | 'last_name' | 'email'
>;
