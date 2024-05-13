import type { FC } from 'react';
import { Stack, Grid, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

import type { CreateBookingPayload } from '../interfaces/booking';

const SurfingExperienceForm: FC = () => {
  const { control } = useFormContext<CreateBookingPayload>();

  return (
    <Stack>
      <Grid container spacing={2}>
        <Grid item>
          <Controller
            key="visit_date"
            control={control}
            disabled={false}
            name="visit_date"
            render={({ field, fieldState }) => (
              <TextField
                disabled={field.disabled}
                // type={formField.type}
                name={field.name}
                label="Visit date"
                placeholder="Visit date (DD/MM/YYYY)"
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
      </Grid>
    </Stack>
  );
};

export default SurfingExperienceForm;
