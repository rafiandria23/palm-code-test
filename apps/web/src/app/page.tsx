'use client';

import type { FC } from 'react';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Container, Stack, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useForm, FormProvider } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';

import BeachImage from '../assets/beach.png';

import { CreateBookingFormPayload } from '../validations/booking';

const BookingForm = dynamic(() => import('../components/BookingForm'), {
  ssr: false,
});

const IndexPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<CreateBookingFormPayload>({
    mode: 'onBlur',
    resolver: classValidatorResolver(CreateBookingFormPayload),
    defaultValues: {
      surfing_experience: 0,
    },
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
    <Container
      component="section"
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FormProvider {...form}>
        <Stack
          component={Paper}
          direction="row"
          sx={{
            background: '#020404',
          }}
        >
          <Image
            alt="Beach."
            src={BeachImage}
            style={{
              width: '529px',
              height: '581px',
            }}
          />

          <BookingForm onSubmit={handleSubmit} />
        </Stack>
      </FormProvider>
    </Container>
  );
};

export default IndexPage;
