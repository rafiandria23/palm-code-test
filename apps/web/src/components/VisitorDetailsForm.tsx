import type { FC } from 'react';
import {
  Grid,
  Autocomplete,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useFormContext, Controller } from 'react-hook-form';

import type { Country } from '../interfaces/setting';
import type { CreateBookingPayload } from '../interfaces/booking';

const VisitorDetailsForm: FC = () => {
  const { control } = useFormContext<CreateBookingPayload>();

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
              fullWidth
              disabled={field.disabled}
              type="text"
              name={field.name}
              label="Name"
              placeholder="Enter your name"
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error || fieldState.invalid}
              helperText={fieldState.error?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Grid>

      <Grid item>
        <Controller
          key="visitor_country_id"
          control={control}
          disabled={false}
          name="visitor_country_id"
          render={({ field, fieldState }) => (
            <Autocomplete
              getOptionKey={(country: Country) => country.id}
              getOptionLabel={(country: Country) =>
                `${country.emoji} ${country.name}`
              }
              options={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  disabled={field.disabled}
                  type="text"
                  name={field.name}
                  label="Country"
                  // select={formField.type === 'select'}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={!!fieldState.error || fieldState.invalid}
                  helperText={fieldState.error?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          )}
        />
      </Grid>

      <Grid item>
        <Controller
          key="visitor_email"
          control={control}
          disabled={false}
          name="visitor_email"
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              disabled={field.disabled}
              type="email"
              name={field.name}
              label="Email"
              placeholder="Enter your email"
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error || fieldState.invalid}
              helperText={fieldState.error?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              fullWidth
              disabled={field.disabled}
              type="tel"
              name={field.name}
              label="Whatsapp number"
              placeholder="Your active number"
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error || fieldState.invalid}
              helperText={fieldState.error?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default VisitorDetailsForm;
