'use client';

import type { FC } from 'react';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Container, Grid, Paper } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';

import BeachImage from '../../public/beach.png';

import type { BookingForm } from '../interfaces/booking';

const IndexPage: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<BookingForm>({
    mode: 'onBlur',
  });

  const handleSubmit = useCallback(() => {
    setLoading(true);
    setLoading(false);
  }, [setLoading]);

  return (
    <Container component="section" maxWidth="sm">
      <FormProvider {...form}>
        <Grid component={Paper} container>
          <Grid item xs={4}>
            <Image alt="Beach." src={BeachImage} />
          </Grid>
          <Grid
            component="form"
            name="booking-form"
            item
            xs={8}
            onSubmit={form.handleSubmit(handleSubmit)}
          ></Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
};

export default IndexPage;
