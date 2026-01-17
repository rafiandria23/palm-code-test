'use client';

import _ from 'lodash';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Grid,
  Autocomplete,
  TextField,
  type IconButtonProps,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import type { CreateBookingFormPayload } from '../interfaces/booking';
import { useAppSelector } from '../hooks/store';
import settingApi from '../services/setting';

const VisitorDetailsForm: FC = () => {
  const bookingState = useAppSelector((state) => state.booking);
  const countries = settingApi.useReadAllCountriesQuery({
    page_size: 500,
  });
  const formCtx = useFormContext<CreateBookingFormPayload>();

  const handleClear = useCallback(
    (key: keyof Pick<CreateBookingFormPayload, 'name' | 'email' | 'phone'>) =>
      () => {
        formCtx.setValue(key, '', {
          shouldValidate: true,
        });
      },
    [formCtx],
  );

  return (
    <Grid container spacing={4}>
      <Grid size={6}>
        <Controller
          key="name"
          control={formCtx.control}
          name="name"
          disabled={bookingState.loading}
          render={({ field, fieldState }) => (
            <TextField
              data-testid={`${field.name}-input`}
              fullWidth
              disabled={field.disabled}
              type="txt"
              name={field.name}
              label="Name"
              placeholder="Enter your name"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error || fieldState.invalid}
              helperText={_.get(fieldState, 'error.message')}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      data-testid={`clear-${field.name}-button`}
                      size="small"
                      onClick={handleClear('name')}
                      sx={{
                        visibility: field.value ? 'visible' : 'hidden',
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ),
                },
              }}
            />
          )}
        />
      </Grid>

      <Grid size={6}>
        <Controller
          key="country_id"
          control={formCtx.control}
          name="country_id"
          disabled={bookingState.loading}
          render={({ field, fieldState }) => (
            <Autocomplete
              fullWidth
              disabled={field.disabled}
              loading={countries.isLoading}
              options={_.get(countries, 'data.data', [])}
              getOptionKey={(country) => country.id}
              getOptionLabel={(country) => `${country.emoji} ${country.name}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(__, value) => field.onChange(_.get(value, 'id'))}
              onBlur={field.onBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  data-testid={`${field.name}-input`}
                  type="text"
                  name={field.name}
                  label="Country"
                  error={!!fieldState.error || fieldState.invalid}
                  helperText={_.get(fieldState, 'error.message')}
                />
              )}
              slotProps={{
                clearIndicator: {
                  ['data-testid']: `clear-${field.name}-button`,
                } as IconButtonProps,
              }}
            />
          )}
        />
      </Grid>

      <Grid size={6}>
        <Controller
          key="email"
          control={formCtx.control}
          name="email"
          disabled={bookingState.loading}
          render={({ field, fieldState }) => (
            <TextField
              data-testid={`${field.name}-input`}
              fullWidth
              disabled={field.disabled}
              type="email"
              name={field.name}
              label="Email"
              placeholder="Enter your email"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error || fieldState.invalid}
              helperText={_.get(fieldState, 'error.message')}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      data-testid={`clear-${field.name}-button`}
                      size="small"
                      onClick={handleClear('email')}
                      sx={{
                        visibility: field.value ? 'visible' : 'hidden',
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ),
                },
              }}
            />
          )}
        />
      </Grid>

      <Grid size={6}>
        <Controller
          key="phone"
          control={formCtx.control}
          name="phone"
          disabled={bookingState.loading}
          render={({ field, fieldState }) => (
            <TextField
              data-testid={`${field.name}-input`}
              fullWidth
              disabled={field.disabled}
              type="tel"
              name={field.name}
              label="WhatsApp number"
              placeholder="Your active number"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={!!fieldState.error || fieldState.invalid}
              helperText={_.get(fieldState, 'error.message')}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      data-testid={`clear-${field.name}-button`}
                      size="small"
                      onClick={handleClear('phone')}
                      sx={{
                        visibility: field.value ? 'visible' : 'hidden',
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ),
                },
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default VisitorDetailsForm;
