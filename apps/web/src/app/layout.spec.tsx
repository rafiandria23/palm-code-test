import type { ImgHTMLAttributes, FC } from 'react';
import { render, screen } from '@testing-library/react';
import { createTheme } from '@mui/material/styles';

import type { ReduxProviderProps } from '../components/providers/ReduxProvider';
import type { DatePickersProviderProps } from '../components/providers/DatePickersProvider';
import type { NotistackProviderProps } from '../components/providers/NotistackProvider';
import RootLayout, { metadata } from './layout';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt} />
  ),
}));

jest.mock('../styles/theme', () => createTheme());

jest.mock('../assets/logo.svg', () => 'logo-image');
jest.mock('../assets/sky.png', () => 'sky-image');
jest.mock('../assets/surfing.png', () => 'surfing-image');

jest.mock('../components/providers/ReduxProvider', () => {
  const ReduxProviderMock: FC<ReduxProviderProps> = ({ children }) => (
    <div data-testid="redux-provider">{children}</div>
  );

  return ReduxProviderMock;
});

jest.mock('../components/providers/DatePickersProvider', () => {
  const DatePickersProviderMock: FC<DatePickersProviderProps> = ({
    children,
  }) => <div data-testid="date-pickers-provider">{children}</div>;

  return DatePickersProviderMock;
});

jest.mock('../components/providers/NotistackProvider', () => {
  const NotistackProviderMock: FC<NotistackProviderProps> = ({ children }) => (
    <div data-testid="notistack-provider">{children}</div>
  );

  return NotistackProviderMock;
});

describe('RootLayout', () => {
  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should have metadata', () => {
    expect(metadata).toHaveProperty('title');
    expect(metadata).toHaveProperty('description');
  });

  it('should render', () => {
    render(
      <RootLayout>
        <div data-testid="root-layout-child" />
      </RootLayout>,
      {
        container: document.documentElement,
      },
    );

    const reduxProvider = screen.getByTestId('redux-provider');
    const datePickersProvider = screen.getByTestId('date-pickers-provider');
    const notistackProvider = screen.getByTestId('notistack-provider');
    const rootLayoutChild = screen.getByTestId('root-layout-child');

    expect(reduxProvider).toBeInTheDocument();
    expect(datePickersProvider).toBeInTheDocument();
    expect(notistackProvider).toBeInTheDocument();
    expect(rootLayoutChild).toBeInTheDocument();
  });
});
