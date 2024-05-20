import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from '../interfaces/store';
import type { SuccessTimestamp } from '../interfaces/api';
import type {
  AuthToken,
  SignUpPayload,
  SignInPayload,
  UpdateEmailPayload,
  UpdatePasswordPayload,
} from '../interfaces/auth';

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth`,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).auth.token.access;

      if (accessToken !== null) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation<
      SuccessTimestamp<undefined, AuthToken>,
      SignUpPayload
    >({
      query: (payload) => ({
        method: 'POST',
        url: '/sign-up',
        body: payload,
      }),
    }),
    signIn: builder.mutation<
      SuccessTimestamp<undefined, AuthToken>,
      SignInPayload
    >({
      query: (payload) => ({
        method: 'POST',
        url: '/sign-in',
        body: payload,
      }),
    }),
    updateEmail: builder.mutation<SuccessTimestamp, UpdateEmailPayload>({
      query: (payload) => ({
        method: 'PATCH',
        url: '/email',
        body: payload,
      }),
    }),
    updatePassword: builder.mutation<SuccessTimestamp, UpdatePasswordPayload>({
      query: (payload) => ({
        method: 'PATCH',
        url: '/password',
        body: payload,
      }),
    }),
    delete: builder.mutation<SuccessTimestamp, void>({
      query: () => ({
        method: 'DELETE',
        url: '',
      }),
    }),
    deactivate: builder.mutation<SuccessTimestamp, void>({
      query: () => ({
        method: 'DELETE',
        url: '/deactivate',
      }),
    }),
  }),
});

export default authApi;
