import _ from 'lodash';
import type { FC, ChangeEventHandler, DragEventHandler } from 'react';
import { useCallback } from 'react';
import Image from 'next/image';
import {
  useTheme,
  Stack,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

import FileIcon from '../assets/file.svg';
import CloseIcon from '../assets/close.svg';

import type { CreateBookingFormPayload } from '../validations/booking';

const NationalIdVerificationForm: FC = () => {
  const theme = useTheme();
  const { setValue, control } = useFormContext<CreateBookingFormPayload>();

  const handleDragOver = useCallback<DragEventHandler<HTMLDivElement>>(
    (e) => e.preventDefault(),
    [],
  );

  const handleDrop = useCallback<DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();

      const file = _.get(e, 'dataTransfer.files[0]', null);

      if (file !== null) {
        setValue('national_id_photo', file);
      }
    },
    [setValue],
  );

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const file = _.get(e, 'currentTarget.files[0]', null) as File | null;

      if (file !== null) {
        setValue('national_id_photo', file);
      }
    },
    [setValue],
  );

  const handleClear = useCallback(() => {
    setValue('national_id_photo', null);
  }, [setValue]);

  return (
    <Stack spacing={4}>
      <Typography gutterBottom paragraph>
        Help us verify your identity by uploading a photo of your ID/KTP or
        Passport
      </Typography>

      <Controller
        key="national_id_photo"
        control={control}
        name="national_id_photo"
        render={({ field }) => (
          <Box
            onDragOver={handleDragOver}
            sx={{
              paddingX: theme.spacing(4),
              paddingY: theme.spacing(2),
              background: '#1A1A1A',
            }}
          >
            {field.value !== null ? (
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
                    {field.value.size}
                  </Typography>
                </Box>

                <div style={{ flexGrow: 1 }} />

                <IconButton size="small" onClick={handleClear}>
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
        )}
      />
    </Stack>
  );
};

export default NationalIdVerificationForm;
