import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { AuthState } from '../interfaces/auth';

const initialState: AuthState = {
  loading: false,
  token: {
    access: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<AuthState['loading']>) => {
      state.loading = action.payload;
    },
    setAccessToken: (
      state,
      action: PayloadAction<AuthState['token']['access']>,
    ) => {
      state.token.access = action.payload;
    },
  },
});

export default authSlice;
