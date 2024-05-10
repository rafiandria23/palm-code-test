import type { FC } from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Stack, Grid, Typography } from '@mui/material';

const BookingDetails: FC = () => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(10);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleRefreshPage = useCallback(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    countdownRef.current = setTimeout(() => {
      if (remainingSeconds > 0) {
        setRemainingSeconds(remainingSeconds - 1);
        return;
      }

      handleRefreshPage();
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [remainingSeconds, setRemainingSeconds, handleRefreshPage]);

  return (
    <Stack>
      <Typography>You&apos;re In!</Typography>
      <Typography>
        Your store visit is booking and you&apos;re ready to ride the shopping
        wave. Here&apos; s your detail:
      </Typography>

      <Grid container></Grid>

      <Typography>
        We look forward to seeing you at the #Swellmatch store! Your booking
        details already sent to your email and whatsapp
      </Typography>

      <Typography>
        This form will refresh automatically in {remainingSeconds} seconds
      </Typography>
    </Stack>
  );
};

export default BookingDetails;
