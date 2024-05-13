import type { FC } from 'react';
import { useState, useMemo, useCallback, memo } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import type { CreateBookingPayload } from '../interfaces/booking';

import VisitorDetailsForm from '../components/VisitorDetailsForm';
import SurfingExperienceForm from '../components/SurfingExperienceForm';
import IdVerificationForm from '../components/IdVerificationForm';

export interface BookingFormProps {
  onSubmit: (payload: CreateBookingPayload) => Promise<void>;
}

const BookingForm: FC<BookingFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState<number>(1);
  const { handleSubmit } = useFormContext<CreateBookingPayload>();

  const steps = useMemo(
    () =>
      new Map([
        [
          1,
          {
            title: 'Visitor Details',
            component: VisitorDetailsForm,
          },
        ],
        [
          2,
          {
            title: 'Surfing Experiences',
            component: SurfingExperienceForm,
          },
        ],
        [
          3,
          {
            title: 'ID Verification',
            component: IdVerificationForm,
          },
        ],
      ]),
    [],
  );

  const handleNextStep = useCallback(() => {
    if (step < steps.size) {
      setStep(step + 1);
    }
  }, [steps, step, setStep]);

  const handleRender = useCallback(() => {
    const { title, component: FormStepComponent } = steps.get(step);

    return (
      <>
        <Typography
          sx={{
            textTransform: 'uppercase',
          }}
        >
          {step}/{steps.size} {title}
        </Typography>

        <FormStepComponent />

        {step === steps.size ? (
          <Button type="submit">Book My Visit</Button>
        ) : (
          <Button onClick={handleNextStep}>Next</Button>
        )}
      </>
    );
  }, [steps, step, handleNextStep]);

  return (
    <Stack
      component="form"
      name="booking-form"
      spacing={4}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography component="h1" variant="h2" gutterBottom>
        Book Your Visit
      </Typography>

      {handleRender()}
    </Stack>
  );
};

export default memo(BookingForm);
