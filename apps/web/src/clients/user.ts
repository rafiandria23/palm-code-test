import type { SuccessTimestamp } from '../interfaces/api';
import type { User } from '../interfaces/user';
import BaseClient from './base';

class UserClient extends BaseClient {
  constructor() {
    super('/users');
  }

  async readById(id: string): Promise<SuccessTimestamp<undefined, User>> {
    const { data } = await this.client.get<SuccessTimestamp<undefined, User>>(
      `/${id}`,
    );

    return data;
  }

  async me(): Promise<SuccessTimestamp<undefined, User>> {
    const { data } = await this.client.get<SuccessTimestamp<undefined, User>>(
      '/me',
    );

    return data;
  }

  async readAll(): Promise<SuccessTimestamp<undefined, User[]>> {
    const { data } = await this.client.get<SuccessTimestamp<undefined, User[]>>(
      '/',
    );

    return data;
  }

  async update(): Promise<SuccessTimestamp> {
    const { data } = await this.client.put<SuccessTimestamp>('/');

    return data;
  }
}

export default UserClient;
