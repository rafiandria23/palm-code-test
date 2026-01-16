'use client';

import {
  type FC,
  type ReactElement,
  type FormEventHandler,
  useState,
  useMemo,
  useCallback,
  memo,
} from 'react';
import { useTheme, Stack, Box, Typography, Button } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import type { CreateBookingFormPayload } from '../interfaces/booking';
import bookingSlice from '../stores/booking';
import { useAppDispatch, useAppSelector } from '../hooks/store';

import VisitorDetailsForm from './VisitorDetailsForm';
import SurfingExperienceForm from './SurfingExperienceForm';
import NationalIdVerificationForm from './NationalIdVerificationForm';
import BookingDetails from './BookingDetails';

export interface BookingFormProps {
  onSubmit(payload: CreateBookingFormPayload): Promise<void>;
}

const BookingForm: FC<BookingFormProps> = ({ onSubmit }) => {
  const dispatch = useAppDispatch();
  const bookingState = useAppSelector((state) => state.booking);
  const theme = useTheme();
  const formCtx = useFormContext<CreateBookingFormPayload>();
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleReset = useCallback(() => {
    setActiveStep(0);
    formCtx.reset();
    dispatch(bookingSlice.actions.setData(null));
  }, [setActiveStep, formCtx, dispatch]);

  const steps = useMemo<
    {
      title?: string;
      component: ReactElement;
      fields?: Array<keyof CreateBookingFormPayload>;
    }[]
  >(
    () => [
      {
        title: 'Visitor Details',
        component: <VisitorDetailsForm />,
        fields: ['name', 'country_id', 'email', 'phone'],
      },
      {
        title: 'Surfing Experiences',
        component: <SurfingExperienceForm />,
        fields: ['surfing_experience', 'date', 'surfboard_id'],
      },
      {
        title: 'ID Verification',
        component: <NationalIdVerificationForm />,
        fields: ['national_id_photo'],
      },
      {
        component: <BookingDetails onTimeout={handleReset} />,
      },
    ],
    [handleReset],
  );

  const validStep = useMemo<boolean>(
    () =>
      steps[activeStep].fields?.every(
        (field) => !formCtx.formState.errors[field],
      ) ?? true,
    [steps, activeStep, formCtx],
  );

  const lastStep = useMemo<boolean>(() => {
    return activeStep === steps.length - 2;
  }, [activeStep, steps]);

  const finished = useMemo<boolean>(() => {
    return activeStep > steps.length - 2;
  }, [activeStep, steps]);

  const handleNext = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      const valid = await formCtx.trigger(steps[activeStep].fields);

      if (valid) {
        if (lastStep) {
          await onSubmit(formCtx.getValues());
        }

        setActiveStep(activeStep + 1);
      }
    },
    [formCtx, steps, activeStep, lastStep, onSubmit, setActiveStep],
  );

  return (
    <Stack
      component="form"
      name="booking-form"
      onSubmit={handleNext}
      sx={{
        height: '581px',
        padding: theme.spacing(6),
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography component="h1" variant="h2" gutterBottom>
          {finished && bookingState.data !== null
            ? `Thank you, ${bookingState.data.name.split(' ')[0]}`
            : 'Book Your Visit'}
        </Typography>

        {!finished && (
          <Typography
            sx={{
              fontWeight: 'normal',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            {activeStep + 1}/{steps.length - 1}: {steps[activeStep].title}
          </Typography>
        )}
      </Box>

      {steps[activeStep].component}

      {!finished && (
        <Box>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disableElevation
            disabled={!validStep}
            loading={bookingState.loading}
            sx={{
              paddingX: theme.spacing(8),
              borderRadius: 'unset',
              background: '#FFFFFF',
              color: '#060B0C',
              '&:hover': {
                background: '#ECECEC',
              },
            }}
          >
            {lastStep ? 'Book My Visit' : 'Next'}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default memo(BookingForm);
