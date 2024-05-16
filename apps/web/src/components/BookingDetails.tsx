import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Stack, Grid, Box, Typography } from '@mui/material';

export interface BookingDetailsProps {
  onTimeout(): void;
}

const BookingDetails: FC<BookingDetailsProps> = ({ onTimeout }) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(10);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

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
    <Stack spacing={4}>
      <Box>
        <Typography gutterBottom>You&apos;re In!</Typography>

        <Typography paragraph>
          Your store visit is booking and you&apos;re ready to ride the shopping
          wave. Here&apos; s your detail:
        </Typography>
      </Box>

      <Grid container columnSpacing={4}>
        <Grid item xs={6}>
          <Typography
            variant="body2"
            sx={{
              color: '#6A6A6A',
            }}
          >
            Name:
          </Typography>

          <Typography>John Doe</Typography>
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

          <Typography>john@doe.com</Typography>
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

          <Typography>23/04/2024</Typography>
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
