import type { SuccessTimestamp } from '../interfaces/api';
import type {
  AuthToken,
  SignUpPayload,
  SignInPayload,
  UpdateEmailPayload,
  UpdatePasswordPayload,
} from '../interfaces/auth';

import BaseClient from './base';

class AuthClient extends BaseClient {
  constructor() {
    super('/auth');
  }

  public async signUp(payload: SignUpPayload) {
    const { data } = await this.client.post<
      SuccessTimestamp<undefined, AuthToken>
    >('/sign-up', payload);

    return data;
  }

  public async signIn(payload: SignInPayload) {
    const { data } = await this.client.post<
      SuccessTimestamp<undefined, AuthToken>
    >('/sign-in', payload);

    return data;
  }

  public async updateEmail(payload: UpdateEmailPayload) {
    const { data } = await this.client.patch<SuccessTimestamp>(
      '/email',
      payload,
    );

    return data;
  }

  public async updatePassword(payload: UpdatePasswordPayload) {
    const { data } = await this.client.patch<SuccessTimestamp>(
      '/password',
      payload,
    );

    return data;
  }

  public async deactivate() {
    const { data } = await this.client.patch<SuccessTimestamp>('/deactivate');

    return data;
  }

  public async delete() {
    const { data } = await this.client.delete<SuccessTimestamp>('/');

    return data;
  }
}

export default AuthClient;
