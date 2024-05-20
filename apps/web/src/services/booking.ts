import _ from 'lodash';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from '../interfaces/store';
import type { SuccessTimestamp, ReadAllMetadata } from '../interfaces/api';
import type { UploadFileData } from '../interfaces/file';
import type {
  Booking,
  CreateBookingPayload,
  ReadAllBookingsPayload,
  ReadBookingByIdPayload,
  UpdateBookingPayload,
  DeleteBookingPayload,
} from '../interfaces/booking';

const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/bookings`,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).auth.token.access;

      if (accessToken !== null) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    uploadNationalIdPhoto: builder.mutation<
      SuccessTimestamp<undefined, UploadFileData>,
      File
    >({
      query: (file) => {
        const payload = new FormData();
        payload.set('national_id_photo', file);

        return {
          method: 'POST',
          url: '/uploads/national-id-photo',
          body: payload,
        };
      },
    }),
    create: builder.mutation<
      SuccessTimestamp<undefined, Booking>,
      CreateBookingPayload
    >({
      query: (payload) => ({
        method: 'POST',
        url: '',
        body: payload,
      }),
    }),
    readAll: builder.query<
      SuccessTimestamp<ReadAllMetadata, Booking[]>,
      ReadAllBookingsPayload
    >({
      query: (payload) => ({
        method: 'GET',
        url: '',
        params: payload,
      }),
    }),
    readById: builder.query<
      SuccessTimestamp<undefined, Booking>,
      ReadBookingByIdPayload
    >({
      query: (payload) => ({
        method: 'GET',
        url: `/${payload.id}`,
      }),
    }),
    update: builder.mutation<SuccessTimestamp, UpdateBookingPayload>({
      query: (payload) => ({
        method: 'PUT',
        url: `/${payload.id}`,
        body: _.omit(payload, ['id']),
      }),
    }),
    delete: builder.mutation<SuccessTimestamp, DeleteBookingPayload>({
      query: (payload) => ({
        method: 'DELETE',
        url: `/${payload.id}`,
      }),
    }),
  }),
});

export default bookingApi;
