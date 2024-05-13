import type { SuccessTimestamp, ReadAllMetadata } from '../interfaces/api';
import type {
  User,
  ReadUserByIdPayload,
  ReadAllUsersPayload,
  UpdateUserPayload,
} from '../interfaces/user';

import BaseClient from './base';

class UserClient extends BaseClient {
  constructor() {
    super('/users');
  }

  public async readAll(payload: ReadAllUsersPayload) {
    const { data } = await this.client.get<
      SuccessTimestamp<ReadAllMetadata, User[]>
    >('/', {
      params: payload,
    });

    return data;
  }

  public async me() {
    const { data } = await this.client.get<SuccessTimestamp<undefined, User>>(
      '/me',
    );

    return data;
  }

  public async readById(payload: ReadUserByIdPayload) {
    const { data } = await this.client.get<SuccessTimestamp<undefined, User>>(
      `/${payload.id}`,
    );

    return data;
  }

  public async update(payload: UpdateUserPayload) {
    const { data } = await this.client.put<SuccessTimestamp>('/', payload);

    return data;
  }
}

export default UserClient;
