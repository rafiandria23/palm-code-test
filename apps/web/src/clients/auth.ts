import type { SuccessTimestamp } from '../interfaces/api';
import BaseClient from './base';

class AuthClient extends BaseClient {
  constructor() {
    super('/auth');
  }

  async signUp() {
    const { data } = await this.client.post('/sign-up');

    return data;
  }

  async signIn() {
    const { data } = await this.client.post('/sign-in');

    return data;
  }

  async updateEmail(): Promise<SuccessTimestamp> {
    const { data } = await this.client.patch<SuccessTimestamp>('/email');

    return data;
  }

  async updatePassword(): Promise<SuccessTimestamp> {
    const { data } = await this.client.patch<SuccessTimestamp>('/password');

    return data;
  }

  async deactivate(): Promise<SuccessTimestamp> {
    const { data } = await this.client.patch<SuccessTimestamp>('/deactivate');

    return data;
  }

  async delete(): Promise<SuccessTimestamp> {
    const { data } = await this.client.delete<SuccessTimestamp>('/');

    return data;
  }
}

export default AuthClient;
