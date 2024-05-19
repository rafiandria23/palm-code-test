import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { Booking, BookingState } from '../interfaces/booking';

const initialState: BookingState = {
  loading: false,
  data: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<BookingState['loading']>) => {
      state.loading = action.payload;
    },
    setData: (state, action: PayloadAction<BookingState['data']>) => {
      state.data = action.payload;
    },
  },
});

export default bookingSlice;
