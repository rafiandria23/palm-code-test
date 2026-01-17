import type { ImgHTMLAttributes } from 'react';
import { render, screen } from '@testing-library/react';
import { createTheme } from '@mui/material/styles';

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

jest.mock('../components/ReduxProvider', () => () => (
  <div data-testid="redux-provider" />
));

jest.mock('../components/DatePickersProvider', () => () => (
  <div data-testid="date-pickers-provider" />
));

jest.mock('../components/NotistackProvider', () => () => (
  <div data-testid="notistack-provider" />
));

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
