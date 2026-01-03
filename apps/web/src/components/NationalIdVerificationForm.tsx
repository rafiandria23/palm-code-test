'use client';

import _ from 'lodash';
import type { FC, ChangeEventHandler, DragEventHandler } from 'react';
import { useCallback } from 'react';
import Image from 'next/image';
import {
  useTheme,
  Grid,
  Box,
  Stack,
  Typography,
  FormHelperText,
  Button,
  IconButton,
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { filesize } from 'filesize';

import FileIcon from '../assets/file.svg';
import CloseIcon from '../assets/close.svg';

import type { CreateBookingFormPayload } from '../interfaces/booking';
import { useAppSelector } from '../hooks/store';

const NationalIdVerificationForm: FC = () => {
  const bookingState = useAppSelector((state) => state.booking);
  const theme = useTheme();
  const formCtx = useFormContext<CreateBookingFormPayload>();

  const handleDragOver = useCallback<DragEventHandler<HTMLDivElement>>(
    (e) => e.preventDefault(),
    [],
  );

  const handleDrop = useCallback<DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();

      if (!bookingState.loading) {
        formCtx.setValue(
          'national_id_photo',
          _.get(e, 'dataTransfer.files[0]', null as unknown as File),
          {
            shouldValidate: true,
          },
        );
      }
    },
    [bookingState, formCtx],
  );

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      formCtx.setValue(
        'national_id_photo',
        _.get(e, 'currentTarget.files[0]', null as unknown as File),
        {
          shouldValidate: true,
        },
      );
    },
    [formCtx],
  );

  const handleClear = useCallback(() => {
    formCtx.setValue('national_id_photo', null as unknown as File, {
      shouldValidate: true,
    });
  }, [formCtx]);

  return (
    <Grid
      container
      sx={{
        height: '50%',
      }}
    >
      <Grid size={12}>
        <Typography gutterBottom>
          Help us verify your identity by uploading a photo of your ID/KTP or
          Passport
        </Typography>
      </Grid>

      <Grid size={12}>
        <Controller
          key="national_id_photo"
          control={formCtx.control}
          name="national_id_photo"
          disabled={bookingState.loading}
          render={({ field, fieldState }) => (
            <Stack spacing={1}>
              <Box
                onDragOver={handleDragOver}
                sx={{
                  paddingX: theme.spacing(4),
                  paddingY: theme.spacing(2),
                  background: '#1A1A1A',
                }}
              >
                {_.get(field, 'value', null) ? (
                  <Stack
                    direction="row"
                    spacing={4}
                    sx={{
                      alignItems: 'center',
                    }}
                  >
                    <Image alt="File icon." src={FileIcon} />

                    <Box>
                      <Typography gutterBottom>{field.value.name}</Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6A6A6A',
                        }}
                      >
                        {filesize(field.value.size, { standard: 'jedec' })}
                      </Typography>
                    </Box>

                    <div style={{ flexGrow: 1 }} />

                    <IconButton
                      size="small"
                      disabled={field.disabled}
                      onClick={handleClear}
                    >
                      <Image alt="Close icon." src={CloseIcon} />
                    </IconButton>
                  </Stack>
                ) : (
                  <Stack
                    spacing={1}
                    onDrop={handleDrop}
                    sx={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      gutterBottom
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      Drag &amp; Drop
                    </Typography>

                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{
                        color: '#6A6A6A',
                      }}
                    >
                      or select files from device max. 2MB
                    </Typography>

                    <Box>
                      <Button
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        variant="text"
                        size="large"
                        disabled={field.disabled}
                        sx={{
                          color: '#FFFFFF',
                          textDecoration: 'underline',
                        }}
                      >
                        Upload{' '}
                        <input
                          type="file"
                          multiple={false}
                          hidden
                          onChange={handleChange}
                        />
                      </Button>
                    </Box>
                  </Stack>
                )}
              </Box>

              {(!!fieldState.error || fieldState.invalid) && (
                <FormHelperText error>
                  {_.get(fieldState, 'error.message')}
                </FormHelperText>
              )}
            </Stack>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default NationalIdVerificationForm;
