import _ from 'lodash';
import type { FC } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Grid, Autocomplete, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

import type { Country } from '../interfaces/setting';
import type { CreateBookingFormPayload } from '../validations/booking';
import SettingClient from '../clients/setting';

const VisitorDetailsForm: FC = () => {
  const { control } = useFormContext<CreateBookingFormPayload>();
  const [loading, setLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<Country[]>([]);

  const fetchCountries = useCallback(async () => {
    setLoading(true);

    // Warning: Bad practice! Refactoring will be done upon submission.
    const client = new SettingClient();

    const { data } = await client.readAllCountries();

    setCountries(data);

    setLoading(false);
  }, []);

  useEffect(() => {
    if (_.isEmpty(countries)) {
      fetchCountries();
    }
  }, [countries, fetchCountries]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Controller
          key="name"
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              fullWidth
              disabled={field.disabled}
              type="txt"
              name={field.name}
              label="Name"
              placeholder="Enter your name"
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error || fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          key="country_id"
          control={control}
          name="country_id"
          render={({ field, fieldState }) => (
            <Autocomplete
              fullWidth
              disabled={field.disabled}
              loading={loading}
              options={countries}
              getOptionKey={(country) => country.id}
              getOptionLabel={(country) => `${country.emoji} ${country.name}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(__, value) => field.onChange(_.get(value, 'id'))}
              onBlur={field.onBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  type="text"
                  name={field.name}
                  label="Country"
                  error={!!fieldState.error || fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          key="email"
          control={control}
          name="email"
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
            />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          key="phone"
          control={control}
          name="phone"
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
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default VisitorDetailsForm;
