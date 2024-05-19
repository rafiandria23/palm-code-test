'use client';

import _ from 'lodash';
import type { FC } from 'react';
import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Container, Stack, Paper, Box, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import BeachImage from '../assets/beach.png';

import type { CreateBookingFormPayload } from '../interfaces/booking';
import { CreateBookingValidationSchema } from '../validations/booking';
import bookingSlice from '../stores/booking';
import { useAppDispatch } from '../hooks/store';
import bookingApi from '../services/booking';

const BookingForm = dynamic(() => import('../components/BookingForm'), {
  ssr: false,
  loading: () => <CircularProgress />,
});

const IndexPage: FC = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [uploadNationalIdPhotoMutation] =
    bookingApi.useUploadNationalIdPhotoMutation();
  const [createBooking] = bookingApi.useCreateMutation();
  const form = useForm<CreateBookingFormPayload>({
    mode: 'onBlur',
    resolver: zodResolver(CreateBookingValidationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country_id: '',
      surfing_experience: 0,
      date: '',
      surfboard_id: '',
      national_id_photo: null as unknown as File,
    },
  });

  const handleSubmit = useCallback(
    async (payload: CreateBookingFormPayload) => {
      try {
        dispatch(bookingSlice.actions.setLoading(true));

        const uploadResult = await uploadNationalIdPhotoMutation(
          payload.national_id_photo,
        ).unwrap();

        const createResult = await createBooking({
          ..._.omit(payload, ['national_id_photo']),
          national_id_photo_file_key: _.get(uploadResult, 'data.file_key'),
        }).unwrap();

        dispatch(
          bookingSlice.actions.setData(_.get(createResult, 'data', null)),
        );

        enqueueSnackbar({
          variant: 'success',
          message: 'Successfully created a booking!',
        });
      } catch (err) {
        enqueueSnackbar({
          variant: 'error',
          message: _.get(err, 'message'),
        });
      } finally {
        dispatch(bookingSlice.actions.setLoading(false));
      }
    },
    [dispatch, uploadNationalIdPhotoMutation, createBooking, enqueueSnackbar],
  );

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
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <BookingForm onSubmit={handleSubmit} />
          </Box>
        </Stack>
      </FormProvider>
    </Container>
  );
};

export default IndexPage;
