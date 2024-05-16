import type { FC, ReactElement, FormEventHandler } from 'react';
import { useState, useMemo, useCallback, memo } from 'react';
import { useTheme, Stack, Box, Typography, Button } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import type { CreateBookingFormPayload } from '../validations/booking';

import VisitorDetailsForm from '../components/VisitorDetailsForm';
import SurfingExperienceForm from '../components/SurfingExperienceForm';
import NationalIdVerificationForm from '../components/NationalIdVerificationForm';
// import BookingDetails from './BookingDetails';

export interface BookingFormProps {
  onSubmit(payload: CreateBookingFormPayload): Promise<void>;
}

const BookingForm: FC<BookingFormProps> = ({ onSubmit }) => {
  const theme = useTheme();
  const { trigger, handleSubmit } = useFormContext<CreateBookingFormPayload>();
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = useMemo<
    {
      title: string;
      component: ReactElement;
      fields: Array<keyof CreateBookingFormPayload>;
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
        fields: [],
      },
    ],
    [],
  );

  const handleReset = useCallback(() => {
    setActiveStep(0);
  }, [setActiveStep]);

  const handleNext = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      const valid = await trigger(steps[activeStep].fields);

      if (valid) {
        if (activeStep < steps.length - 1) {
          setActiveStep(activeStep + 1);
          return;
        }

        // await handleSubmit(onSubmit);

        handleReset();
      }
    },
    [trigger, steps, activeStep, setActiveStep, handleSubmit, handleReset],
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
          Book Your Visit
        </Typography>

        <Typography
          sx={{
            fontWeight: 'normal',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
          }}
        >
          {activeStep + 1}/{steps.length}: {steps[activeStep].title}
        </Typography>
      </Box>

      {steps[activeStep].component}

      <Box>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disableElevation
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
          {activeStep + 1 >= steps.length ? 'Book My Visit' : 'Next'}
        </Button>
      </Box>
    </Stack>
  );
};

export default memo(BookingForm);
