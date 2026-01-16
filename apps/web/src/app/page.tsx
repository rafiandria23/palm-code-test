'use client';

import _ from 'lodash';
import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Container, Stack, Paper, Box, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { faker } from '@faker-js/faker';

import BeachImage from '../assets/beach.png';

import type { CreateBookingFormPayload } from '../interfaces/booking';
import { CreateBookingValidationSchema } from '../validations/booking';
import authSlice from '../stores/auth';
import bookingSlice from '../stores/booking';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import authApi from '../services/auth';
import bookingApi from '../services/booking';

import BookingForm from '../components/BookingForm';

const IndexPage: FC = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [authSignUpMutation] = authApi.useSignUpMutation();
  const [uploadBookingNationalIdPhotoMutation] =
    bookingApi.useUploadNationalIdPhotoMutation();
  const [createBookingMutation] = bookingApi.useCreateMutation();
  const form = useForm<CreateBookingFormPayload>({
    mode: 'onBlur',
    resolver: zodResolver(CreateBookingValidationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country_id: '',
      surfing_experience: 0,
      date: null as unknown as Date,
      surfboard_id: '',
      national_id_photo: null as unknown as File,
    },
  });

  const handleSignUp = useCallback(async () => {
    try {
      dispatch(authSlice.actions.setLoading(true));

      const signUpResult = await authSignUpMutation({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }).unwrap();

      dispatch(
        authSlice.actions.setAccessToken(signUpResult.data.access_token),
      );
    } catch (err) {
      enqueueSnackbar({
        variant: 'error',
        message: _.get(err, 'message'),
      });
    } finally {
      dispatch(authSlice.actions.setLoading(false));
    }
  }, [dispatch, authSignUpMutation, enqueueSnackbar]);

  useEffect(() => {
    handleSignUp();
  }, []);

  const handleSubmit = useCallback(
    async (payload: CreateBookingFormPayload) => {
      try {
        dispatch(bookingSlice.actions.setLoading(true));

        const uploadResult = await uploadBookingNationalIdPhotoMutation(
          payload.national_id_photo,
        ).unwrap();

        const createResult = await createBookingMutation({
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
    [
      dispatch,
      uploadBookingNationalIdPhotoMutation,
      createBookingMutation,
      enqueueSnackbar,
    ],
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
            {authState.token.access ? (
              <BookingForm onSubmit={handleSubmit} />
            ) : (
              <CircularProgress />
            )}
          </Box>
        </Stack>
      </FormProvider>
    </Container>
  );
};

export default IndexPage;
