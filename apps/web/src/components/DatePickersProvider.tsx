'use client';

import { type FC, type ReactNode, memo } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface DatePickersProviderProps {
  children: ReactNode;
}

const DatePickersProvider: FC<DatePickersProviderProps> = ({ children }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    {children}
  </LocalizationProvider>
);

export default memo(DatePickersProvider);
