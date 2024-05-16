import _ from 'lodash';
import type { FC } from 'react';
import { useState, useCallback, useEffect, useMemo } from 'react';
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

import type { Surfboard } from '../interfaces/setting';
import type { CreateBookingFormPayload } from '../validations/booking';
import SettingClient from '../clients/setting';
import SurfboardSliderThumb from './SurfboardSliderThumb';
import SurfboardSliderMarkLabel from './SurfboardSliderMarkLabel';

const SurfingExperienceForm: FC = () => {
  const theme = useTheme();
  const { setValue, control } = useFormContext<CreateBookingFormPayload>();
  const [loading, setLoading] = useState<boolean>(false);
  const [surfboards, setSurfboards] = useState<Surfboard[]>([]);

  const fetchSurfboards = useCallback(async () => {
    setLoading(true);

    // Warning: Bad practice! Refactoring will be done upon submission.
    const client = new SettingClient();

    const { data } = await client.readAllSurfboards();

    setSurfboards(data);

    setLoading(false);
  }, []);

  useEffect(() => {
    if (_.isEmpty(surfboards)) {
      fetchSurfboards();
    }
  }, [surfboards, fetchSurfboards]);

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

  const handleDateChange = useCallback(
    (date: Dayjs | null) => {
      if (date !== null) {
        setValue('date', dayjs(date).format('YYYY-MM-DD'));
        return;
      }

      setValue('date', '');
    },
    [setValue],
  );

  const handleDateClear = useCallback(() => {
    setValue('date', '');
  }, [setValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container columnSpacing={4}>
        <Grid item xs={12}>
          <Typography gutterBottom>Your Surfing Experience</Typography>

          <Controller
            key="surfing_experience"
            control={control}
            name="surfing_experience"
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

        <Grid item xs={6}>
          <Controller
            key="date"
            control={control}
            name="date"
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
                  field: {
                    clearable: true,
                    onClear: handleDateClear,
                  },
                  textField: {
                    placeholder: 'Visit date (DD/MM/YYYY)',
                    onBlur: field.onBlur,
                    error: !!fieldState.error || fieldState.invalid,
                    helperText: fieldState.error?.message,
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <Controller
            key="surfboard_id"
            control={control}
            name="surfboard_id"
            render={({ field, fieldState }) => (
              <Autocomplete
                fullWidth
                disabled={field.disabled}
                loading={loading}
                options={surfboards}
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
                    helperText={fieldState.error?.message}
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
