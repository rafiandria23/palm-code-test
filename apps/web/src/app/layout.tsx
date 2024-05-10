import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Stack,
} from '@mui/material';

import '../styles/global.scss';
import theme from '../styles/theme';

import SkyImage from '../../public/sky.png';
import SurfingImage from '../../public/surfing.png';
import LogoImage from '../../public/logo.svg';

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
            <CssBaseline />

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
                  position: 'absolute',
                  zIndex: 1,
                }}
              />
              <Image
                alt="Surfing."
                src={SurfingImage}
                quality={100}
                fill
                sizes="100vw"
                style={{
                  position: 'absolute',
                  objectFit: 'cover',
                  objectPosition: '0 8rem',
                  zIndex: 2,
                }}
              />
            </>

            {/* Header */}
            <AppBar
              component="header"
              sx={{
                zIndex: 3,
                mt: '2rem',
                background: 'transparent',
                boxShadow: 'none',
              }}
            >
              <Toolbar
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  alt="Logo."
                  src={LogoImage}
                  style={{
                    width: '8rem',
                    height: '4rem',
                  }}
                />
              </Toolbar>
            </AppBar>

            {/* Main */}
            <Stack
              component="main"
              sx={{
                position: 'relative',
                zIndex: 4,
                mt: '8rem',
              }}
            >
              {children}
            </Stack>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
