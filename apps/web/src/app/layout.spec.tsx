import { render, screen } from '@testing-library/react';

import RootLayout from './layout';

// Mock fonts properly to satisfy theme.ts
jest.mock('next/font/google', () => ({
  Inter: jest.fn().mockReturnValue({
    className: 'inter-font',
    style: { fontFamily: 'Inter' },
  }),
  Outfit: jest.fn().mockReturnValue({
    className: 'outfit-font',
    style: { fontFamily: 'Outfit' },
  }),
  Bodoni_Moda: jest.fn().mockReturnValue({
    className: 'bodoni-moda-font',
    style: { fontFamily: 'Bodoni Moda' },
  }),
}));

jest.mock('../components/ReduxProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="redux-provider">{children}</div>
  ),
}));

jest.mock('../components/NotistackProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="notistack-provider">{children}</div>
  ),
}));

describe('RootLayout', () => {
  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('renders correctly with children and essential elements', () => {
    // We avoid rendering directly into the document or documentElement to prevent hydration warnings
    // RTL's default rendering into a <div> is fine for verifying providers and children presence.
    render(
      <RootLayout>
        <div data-testid="test-child">Content</div>
      </RootLayout>,
    );

    expect(screen.getByTestId('redux-provider')).toBeInTheDocument();
    expect(screen.getByTestId('notistack-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
