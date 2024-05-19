'use client';

import type { FC, ReactNode } from 'react';
import { memo } from 'react';
import { Provider } from 'react-redux';

// Redux
import store from '../stores';

export interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider: FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default memo(ReduxProvider);
