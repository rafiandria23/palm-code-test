'use client';

import type { FC } from 'react';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Container, Grid, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useForm, FormProvider } from 'react-hook-form';

import BeachImage from '../../public/beach.png';

import type { BookingFormPayload } from '../interfaces/booking';

const BookingForm = dynamic(() => import('../components/BookingForm'), {
  ssr: false,
});

const IndexPage: FC = () => {
  const [, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const form = useForm<BookingFormPayload>({
    mode: 'onBlur',
  });

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      enqueueSnackbar({
        variant: 'success',
      });
    } catch (err) {
      setLoading(false);
      enqueueSnackbar({
        variant: 'error',
      });
    }
  }, [setLoading, enqueueSnackbar]);

  return (
    <Container component="section">
      <FormProvider {...form}>
        <Grid component={Paper} container>
          <Grid item xs={6}>
            <Image
              alt="Beach."
              src={BeachImage}
              style={{
                height: '100%',
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <BookingForm onSubmit={handleSubmit} />
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
};

export default IndexPage;
