import type { SuccessTimestamp } from '../interfaces/api';
import type { User } from '../interfaces/user';

import BaseClient from './base';

class UserClient extends BaseClient {
  constructor() {
    super('/users');
  }

  public async me() {
    const { data } = await this.client.get<SuccessTimestamp<undefined, User>>(
      '/me',
    );

    return data;
  }

  public async readById(id: string) {
    const { data } = await this.client.get<SuccessTimestamp<undefined, User>>(
      `/${id}`,
    );

    return data;
  }

  public async readAll() {
    const { data } = await this.client.get<SuccessTimestamp<undefined, User[]>>(
      '/',
    );

    return data;
  }

  public async update() {
    const { data } = await this.client.put<SuccessTimestamp>('/');

    return data;
  }
}

export default UserClient;
