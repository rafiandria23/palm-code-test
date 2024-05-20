'use client';

import _ from 'lodash';
import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Stack, Grid, Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { useAppSelector } from '../hooks/store';

export interface BookingDetailsProps {
  onTimeout(): void;
}

const BookingDetails: FC<BookingDetailsProps> = ({ onTimeout }) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(10);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const bookingState = useAppSelector((state) => state.booking);

  useEffect(() => {
    countdownRef.current = setTimeout(() => {
      if (remainingSeconds > 0) {
        setRemainingSeconds(remainingSeconds - 1);
        return;
      }

      onTimeout();
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [onTimeout, remainingSeconds, setRemainingSeconds]);

  return (
    <Stack
      sx={{
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography gutterBottom>You&apos;re In!</Typography>

        <Typography paragraph>
          Your store visit is booking and you&apos;re ready to ride the shopping
          wave. Here&apos;s your detail:
        </Typography>
      </Box>

      <Grid container rowSpacing={2}>
        <Grid item xs={6}>
          <Typography
            variant="body2"
            sx={{
              color: '#6A6A6A',
            }}
          >
            Name:
          </Typography>

          <Typography>{_.get(bookingState, 'data.name')}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography
            variant="body2"
            sx={{
              color: '#6A6A6A',
            }}
          >
            Country:
          </Typography>

          <Typography>
            {_.get(bookingState, 'data.country.emoji')}{' '}
            {_.get(bookingState, 'data.country.name')}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography
            variant="body2"
            sx={{
              color: '#6A6A6A',
            }}
          >
            Email:
          </Typography>

          <Typography>{_.get(bookingState, 'data.email')}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography
            variant="body2"
            sx={{
              color: '#6A6A6A',
            }}
          >
            Visit date:
          </Typography>

          {bookingState.data !== null && (
            <Typography>
              {dayjs(bookingState.data.date, 'YYYY-MM-DD').format('DD/MM/YYYY')}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Typography paragraph>
        We look forward to seeing you at the #Swellmatch store! Your booking
        details already sent to your email and whatsapp
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: '#6A6A6A',
        }}
      >
        This form will refresh automatically in {remainingSeconds} seconds
      </Typography>
    </Stack>
  );
};

export default BookingDetails;
