'use client';

import { type FC, type ReactNode, memo } from 'react';
import { SnackbarProvider } from 'notistack';

export interface NotistackProviderProps {
  children: ReactNode;
}

const NotistackProvider: FC<NotistackProviderProps> = ({ children }) => (
  <SnackbarProvider>{children}</SnackbarProvider>
);

export default memo(NotistackProvider);
