'use client';

import {
  Bodoni_Moda as BodoniModaFont,
  Inter as InterFont,
} from 'next/font/google';
import { createTheme } from '@mui/material/styles';

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
  palette: {
    mode: 'dark',
  },
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
    MuiCircularProgress: {
      defaultProps: {
        sx: {
          color: '#FFFFFF',
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        disableInjectingGlobalStyles: true,
        sx: {
          borderRadius: 'unset',
        },
      },
      styleOverrides: {
        root: {
          background: '#232323',
        },
        input: {
          '&:-webkit-autofill': {
            '-webkit-box-shadow': '0 0 0 100px #232323 inset !important',
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          '&::before, &::after': {
            borderBottom: 'unset',
          },
          '&:hover:not(.Mui-disabled, .Mui-error):before': {
            borderBottom: 'unset',
          },
          '&.Mui-focused:after': {
            borderBottom: 'unset',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        root: {
          color: '#CCCCCC',
          '& label.Mui-focused': {
            color: '#CCCCCC',
          },
        },
      },
    },
  },
});

export default theme;
