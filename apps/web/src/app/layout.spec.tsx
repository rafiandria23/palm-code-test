import type { ImgHTMLAttributes, FC } from 'react';
import { render, screen } from '@testing-library/react';
import { createTheme } from '@mui/material/styles';

import type { ReduxProviderProps } from '../components/ReduxProvider';
import type { DatePickersProviderProps } from '../components/DatePickersProvider';
import type { NotistackProviderProps } from '../components/NotistackProvider';
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

jest.mock('../components/ReduxProvider', () => {
  const ReduxProviderMock: FC<ReduxProviderProps> = ({ children }) => (
    <div data-testid="redux-provider">{children}</div>
  );

  return ReduxProviderMock;
});

jest.mock('../components/DatePickersProvider', () => {
  const DatePickersProviderMock: FC<DatePickersProviderProps> = ({
    children,
  }) => <div data-testid="date-pickers-provider">{children}</div>;

  return DatePickersProviderMock;
});

jest.mock('../components/NotistackProvider', () => {
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
    expect(metadata).toEqual({
      title: 'Palm Code Test Web',
      description: 'Test for Palm Code.',
    });
  });

  it('should render', () => {
    render(
      <RootLayout>
        <div data-testid="root-layout-child" />
      </RootLayout>,
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
