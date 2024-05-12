import type {
  SuccessTimestamp,
  PaginationQuery,
  SortQuery,
  ReadAllMetadata,
} from '../interfaces/api';
import { Booking } from '../interfaces/booking';

import BaseClient from './base';

class BookingClient extends BaseClient {
  constructor() {
    super('/bookings');
  }

  public async create() {
    const { data } = await this.client.post<
      SuccessTimestamp<undefined, Booking>
    >('/');

    return data;
  }

  public async readAll(queries) {
    const { data } = await this.client.get<
      SuccessTimestamp<ReadAllMetadata, Booking[]>
    >('/');

    return data;
  }

  public async readById(id: string) {
    const { data } = await this.client.get<
      SuccessTimestamp<undefined, Booking>
    >(`/${id}`);

    return data;
  }

  public async update(id: string) {
    const { data } = await this.client.put<SuccessTimestamp>(`/${id}`);

    return data;
  }

  public async delete(id: string) {
    const { data } = await this.client.delete<SuccessTimestamp>(`/${id}`);

    return data;
  }
}

export default BookingClient;
