import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { SuccessTimestamp, ReadAllMetadata } from '../interfaces/api';
import type {
  User,
  ReadAllUsersPayload,
  ReadUserByIdPayload,
  UpdateUserPayload,
} from '../interfaces/user';

const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users`,
  }),
  endpoints: (builder) => ({
    readAll: builder.query<
      SuccessTimestamp<ReadAllMetadata, User[]>,
      ReadAllUsersPayload
    >({
      query: (payload) => ({
        url: '',
        params: payload,
      }),
    }),
    me: builder.query<SuccessTimestamp<undefined, User>, void>({
      query: () => ({
        url: '/me',
      }),
    }),
    readById: builder.query<
      SuccessTimestamp<undefined, User>,
      ReadUserByIdPayload
    >({
      query: (payload) => ({
        url: `/${payload.id}`,
      }),
    }),
    update: builder.mutation<SuccessTimestamp, UpdateUserPayload>({
      query: (payload) => ({
        method: 'PUT',
        url: '',
        body: payload,
      }),
    }),
  }),
});

export default userApi;
