import type { User } from './user';

export interface AuthToken {
  access_token: string;
}

export interface SignUpPayload
  extends Pick<User, 'first_name' | 'last_name' | 'email'> {
  password: string;
}

export type SignInPayload = Pick<SignUpPayload, 'email' | 'password'>;

export type UpdateEmailPayload = Pick<User, 'email'>;

export interface UpdatePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface AuthState {
  loading: boolean;
  token: {
    access: string | null;
  };
}
