'use client';

import _ from 'lodash';
import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import type { SliderProps } from '@mui/material';
import {
  useTheme,
  Grid,
  Typography,
  Autocomplete,
  Slider,
  TextField,
} from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

import type { CreateBookingFormPayload } from '../interfaces/booking';
import { useAppSelector } from '../hooks/store';
import settingApi from '../services/setting';

import SurfboardSliderThumb from './SurfboardSliderThumb';
import SurfboardSliderMarkLabel from './SurfboardSliderMarkLabel';

const SurfingExperienceForm: FC = () => {
  const bookingState = useAppSelector((state) => state.booking);
  const surfboards = settingApi.useReadAllSurfboardsQuery({
    page_size: 500,
  });
  const theme = useTheme();
  const formCtx = useFormContext<CreateBookingFormPayload>();

  const marks = useMemo<SliderProps['marks']>(() => {
    const max = 11;

    return Array.from({ length: max }).map((__, idx) => {
      return {
        value: idx,
        label: idx + 1 === max ? `${idx}+` : idx.toString(),
      };
    });
  }, []);

  const tomorrow = useMemo<Dayjs>(() => {
    const today = dayjs();

    return today.add(1, 'day');
  }, []);

  const handleDateClear = useCallback(() => {
    formCtx.resetField('date');
  }, [formCtx]);

  const handleDateChange = useCallback(
    (date: Dayjs | null) => {
      if (date !== null) {
        formCtx.setValue('date', date.toDate(), { shouldValidate: true });
        return;
      }

      handleDateClear();
    },
    [formCtx, handleDateClear],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container columnSpacing={4}>
        <Grid size={12}>
          <Typography gutterBottom>Your Surfing Experience</Typography>

          <Controller
            key="surfing_experience"
            control={formCtx.control}
            name="surfing_experience"
            disabled={bookingState.loading}
            render={({ field }) => (
              <Slider
                disabled={field.disabled}
                name={field.name}
                track={false}
                min={0}
                max={10}
                step={1}
                shiftStep={1}
                marks={marks}
                onChange={field.onChange}
                onBlur={field.onBlur}
                slotProps={{
                  rail: {
                    style: {
                      height: theme.spacing(1.2),
                      background: 'linear-gradient(to right, #FFFFFF, #05B3BE)',
                      opacity: '100%',
                    },
                  },
                  thumb: {
                    style: {
                      color: 'transparent',
                    },
                  },
                  mark: {
                    hidden: true,
                  },
                }}
                slots={{
                  thumb: SurfboardSliderThumb,
                  markLabel: SurfboardSliderMarkLabel,
                }}
                sx={{
                  mt: theme.spacing(6),
                  borderRadius: 'unset',
                }}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            key="date"
            control={formCtx.control}
            name="date"
            disabled={bookingState.loading}
            render={({ field, fieldState }) => (
              <DatePicker
                disabled={field.disabled}
                name={field.name}
                disablePast
                minDate={tomorrow}
                format="DD/MM/YYYY"
                label="Visit Date"
                onChange={handleDateChange}
                slotProps={{
                  layout: {
                    sx: {
                      background: '#232323',
                      color: '#FFFFFF',
                    },
                  },
                  day: {
                    sx: {
                      color: '#FFFFFF',
                      '&.Mui-selected, &:hover.Mui-selected, &:focus.Mui-selected':
                        {
                          backgroundColor: '#FFFFFF',
                        },
                    },
                  },
                  field: {
                    clearable: true,
                    onClear: handleDateClear,
                  },
                  textField: {
                    placeholder: 'Visit date (DD/MM/YYYY)',
                    onBlur: field.onBlur,
                    error: !!fieldState.error || fieldState.invalid,
                    helperText: _.get(fieldState, 'error.message'),
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            key="surfboard_id"
            control={formCtx.control}
            name="surfboard_id"
            disabled={bookingState.loading}
            render={({ field, fieldState }) => (
              <Autocomplete
                fullWidth
                disabled={field.disabled}
                loading={surfboards.isLoading}
                options={_.get(surfboards, 'data.data', [])}
                getOptionKey={(surfboard) => surfboard.id}
                getOptionLabel={(surfboard) => surfboard.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(__, value) => field.onChange(_.get(value, 'id'))}
                onBlur={field.onBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    type="text"
                    name={field.name}
                    label="Your desired board"
                    error={!!fieldState.error || fieldState.invalid}
                    helperText={_.get(fieldState, 'error.message')}
                  />
                )}
              />
            )}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default SurfingExperienceForm;
