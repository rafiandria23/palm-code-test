import _ from 'lodash';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { SuccessTimestamp, ReadAllMetadata } from '../interfaces/api';
import type {
  Country,
  Surfboard,
  CreateCountryPayload,
  CreateSurfboardPayload,
  ReadAllCountriesPayload,
  ReadCountryByIdPayload,
  ReadAllSurfboardsPayload,
  ReadSurfboardByIdPayload,
  UpdateCountryPayload,
  UpdateSurfboardPayload,
  DeleteCountryPayload,
  DeleteSurfboardPayload,
} from '../interfaces/setting';

const settingApi = createApi({
  reducerPath: 'settingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/settings`,
  }),
  endpoints: (builder) => ({
    createCountry: builder.mutation<
      SuccessTimestamp<undefined, Country>,
      CreateCountryPayload
    >({
      query: (payload) => ({
        url: '/countries',
        body: payload,
      }),
    }),
    createSurfboard: builder.mutation<
      SuccessTimestamp<undefined, Surfboard>,
      CreateSurfboardPayload
    >({
      query: (payload) => ({
        url: '/surfboards',
        body: payload,
      }),
    }),
    readAllCountries: builder.query<
      SuccessTimestamp<ReadAllMetadata, Country[]>,
      ReadAllCountriesPayload
    >({
      query: (payload) => ({
        url: '/countries',
        params: payload,
      }),
    }),
    readCountryById: builder.query<
      SuccessTimestamp<undefined, Country>,
      ReadCountryByIdPayload
    >({
      query: (payload) => ({
        url: `/countries/${payload.id}`,
      }),
    }),
    readAllSurfboards: builder.query<
      SuccessTimestamp<ReadAllMetadata, Surfboard[]>,
      ReadAllSurfboardsPayload
    >({
      query: (payload) => ({
        url: '/surfboards',
        params: payload,
      }),
    }),
    readSurfboardById: builder.query<
      SuccessTimestamp<undefined, Surfboard>,
      ReadSurfboardByIdPayload
    >({
      query: (payload) => ({
        url: `/surfboards/${payload.id}`,
      }),
    }),
    updateCountry: builder.mutation<SuccessTimestamp, UpdateCountryPayload>({
      query: (payload) => ({
        method: 'PUT',
        url: `/countries/${payload.id}`,
        body: _.omit(payload, ['id']),
      }),
    }),
    updateSurfboard: builder.mutation<SuccessTimestamp, UpdateSurfboardPayload>(
      {
        query: (payload) => ({
          method: 'PUT',
          url: `/surfboards/${payload.id}`,
          body: _.omit(payload, ['id']),
        }),
      },
    ),
    deleteCountry: builder.mutation<SuccessTimestamp, DeleteCountryPayload>({
      query: (payload) => ({
        method: 'DELETE',
        url: `/countries/${payload.id}`,
      }),
    }),
    deleteSurfboard: builder.mutation<SuccessTimestamp, DeleteSurfboardPayload>(
      {
        query: (payload) => ({
          method: 'DELETE',
          url: `/surfboards/${payload.id}`,
        }),
      },
    ),
  }),
});

export default settingApi;
