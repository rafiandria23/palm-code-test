import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material';

import '../styles/global.scss';
import theme from '../styles/theme';

import SkyImage from '../../public/sky.svg';
import SurfingImage from '../../public/surfing.svg';

export const metadata: Metadata = {
  title: 'Palm Code Test Web',
  description: 'Test for Palm Code.',
};

export interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {/* Background */}
            <>
              <Image
                alt="Sky."
                src={SkyImage}
                quality={100}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: '0 -8rem',
                  opacity: '20%',
                }}
              />
              <Image
                alt="Surfing."
                src={SurfingImage}
                quality={100}
                fill
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: '0 8rem',
                }}
              />
            </>

            {/* Header */}
            <header />

            {/* Main */}
            <main>{children}</main>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
