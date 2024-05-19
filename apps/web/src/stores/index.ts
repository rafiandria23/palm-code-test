import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import settingApi from '../services/setting';
import authApi from '../services/auth';
import userApi from '../services/user';
import bookingApi from '../services/booking';

import bookingSlice from './booking';

const store = configureStore({
  reducer: {
    [settingApi.reducerPath]: settingApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    booking: bookingSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      settingApi.middleware,
      authApi.middleware,
      userApi.middleware,
      bookingApi.middleware,
    ),
});

setupListeners(store.dispatch);

export default store;
