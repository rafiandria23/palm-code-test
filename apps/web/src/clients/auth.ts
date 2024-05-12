import type { SuccessTimestamp } from '../interfaces/api';
import type { AuthToken } from '../interfaces/auth';

import BaseClient from './base';

class AuthClient extends BaseClient {
  constructor() {
    super('/auth');
  }

  public async signUp() {
    const { data } = await this.client.post<
      SuccessTimestamp<undefined, AuthToken>
    >('/sign-up');

    return data;
  }

  public async signIn() {
    const { data } = await this.client.post<
      SuccessTimestamp<undefined, AuthToken>
    >('/sign-in');

    return data;
  }

  public async updateEmail() {
    const { data } = await this.client.patch<SuccessTimestamp>('/email');

    return data;
  }

  public async updatePassword() {
    const { data } = await this.client.patch<SuccessTimestamp>('/password');

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
