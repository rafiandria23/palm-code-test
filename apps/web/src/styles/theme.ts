'use client';

import {
  Bodoni_Moda as BodoniModaFont,
  Inter as InterFont,
} from 'next/font/google';
import { createTheme } from '@mui/material';

const bodoniModaFont = BodoniModaFont({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});
const interFont = InterFont({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const theme = createTheme({
  typography: {
    fontFamily: interFont.style.fontFamily,
    h1: {
      fontFamily: bodoniModaFont.style.fontFamily,
    },
    h2: {
      fontFamily: bodoniModaFont.style.fontFamily,
    },
    h3: {
      fontFamily: bodoniModaFont.style.fontFamily,
    },
    h4: {
      fontFamily: bodoniModaFont.style.fontFamily,
    },
    h5: {
      fontFamily: bodoniModaFont.style.fontFamily,
    },
    h6: {
      fontFamily: bodoniModaFont.style.fontFamily,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiInputBase: {
      defaultProps: {
        disableInjectingGlobalStyles: true,
      },
    },
  },
});

export default theme;
