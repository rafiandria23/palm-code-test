import _ from 'lodash';

import type { SuccessTimestamp, ReadAllMetadata } from '../interfaces/api';
import type {
  Booking,
  CreateBookingPayload,
  ReadAllBookingsPayload,
  ReadBookingByIdPayload,
  UpdateBookingPayload,
  DeleteBookingPayload,
} from '../interfaces/booking';

import BaseClient from './base';

class BookingClient extends BaseClient {
  constructor() {
    super('/bookings');
  }

  public async create(payload: CreateBookingPayload) {
    const { data } = await this.client.post<
      SuccessTimestamp<undefined, Booking>
    >('/', payload);

    return data;
  }

  public async uploadNationalIdPhoto(file: File) {
    const payload = new FormData();
    payload.set('national_id_photo', file);

    const { data } = await this.client.post<
      SuccessTimestamp<undefined, { file_key: string }>
    >('/uploads/national-id-photo', payload);

    return data;
  }

  public async readAll(payload: ReadAllBookingsPayload) {
    const { data } = await this.client.get<
      SuccessTimestamp<ReadAllMetadata, Booking[]>
    >('/', {
      params: payload,
    });

    return data;
  }

  public async readById(payload: ReadBookingByIdPayload) {
    const { data } = await this.client.get<
      SuccessTimestamp<undefined, Booking>
    >(`/${payload.id}`);

    return data;
  }

  public async update(payload: UpdateBookingPayload) {
    const { data } = await this.client.put<SuccessTimestamp>(
      `/${payload.id}`,
      _.omit(payload, ['id']),
    );

    return data;
  }

  public async delete(payload: DeleteBookingPayload) {
    const { data } = await this.client.delete<SuccessTimestamp>(
      `/${payload.id}`,
    );

    return data;
  }
}

export default BookingClient;
