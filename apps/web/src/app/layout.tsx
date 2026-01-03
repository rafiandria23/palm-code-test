import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import {
  ThemeProvider,
  CssBaseline,
  Stack,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';

import '../styles/global.scss';
import theme from '../styles/theme';

import LogoImage from '../assets/logo.svg';
import SkyImage from '../assets/sky.png';
import SurfingImage from '../assets/surfing.png';

import ReduxProvider from '../components/ReduxProvider';
import NotistackProvider from '../components/NotistackProvider';

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
      <Stack
        component="body"
        sx={{
          position: 'relative',
          justifyContent: 'center',
        }}
      >
        <ReduxProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />

              <NotistackProvider>
                {/* Background */}
                <>
                  <Image
                    alt="Sky."
                    src={SkyImage}
                    priority
                    quality={100}
                    fill
                    sizes="100vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: '0 -8rem',
                      opacity: '20%',
                      position: 'absolute',
                    }}
                  />

                  <Image
                    alt="Surfing."
                    src={SurfingImage}
                    priority
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
                      width={8}
                      height={4}
                      style={{
                        width: '8rem',
                        height: '4rem',
                      }}
                    />
                  </Toolbar>
                </AppBar>

                {/* Main */}
                <Box
                  component="main"
                  sx={{
                    position: 'relative',
                    zIndex: 4,
                    mt: '8rem',
                  }}
                >
                  {children}
                </Box>
              </NotistackProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </Stack>
    </html>
  );
};

export default RootLayout;
