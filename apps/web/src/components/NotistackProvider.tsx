'use client';

import type { FC, ReactNode } from 'react';
import { memo } from 'react';
import { SnackbarProvider } from 'notistack';

export interface NotistackProviderProps {
  children: ReactNode;
}

const NotistackProvider: FC<NotistackProviderProps> = ({ children }) => {
  return <SnackbarProvider>{children}</SnackbarProvider>;
};

export default memo(NotistackProvider);
