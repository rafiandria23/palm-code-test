import type { FC } from 'react';
import { Grid, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

import type { BookingFormPayload } from '../interfaces/booking';

const VisitorDetailsForm: FC = () => {
  const { control } = useFormContext<BookingFormPayload>();

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Controller
          key="visitor_name"
          control={control}
          disabled={false}
          name="visitor_name"
          render={({ field, fieldState }) => (
            <TextField
              disabled={field.disabled}
              // type={formField.type}
              name={field.name}
              label="Name"
              placeholder="Enter your name"
              // select={formField.type === 'select'}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error || fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid item>
        <TextField />
      </Grid>

      <Grid item>
        <Controller
          key="visitor_email"
          control={control}
          disabled={false}
          name="visitor_email"
          render={({ field, fieldState }) => (
            <TextField
              disabled={field.disabled}
              // type={formField.type}
              name={field.name}
              label="Email"
              placeholder="Enter your email"
              // select={formField.type === 'select'}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error || fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid item>
        <Controller
          key="visitor_phone"
          control={control}
          disabled={false}
          name="visitor_phone"
          render={({ field, fieldState }) => (
            <TextField
              disabled={field.disabled}
              // type={formField.type}
              name={field.name}
              label="Whatsapp number"
              placeholder="Your active number"
              // select={formField.type === 'select'}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error || fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default VisitorDetailsForm;
