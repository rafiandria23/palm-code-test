import type { FC } from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';

const IdVerificationForm: FC = () => {
  return (
    <Stack>
      <Typography>
        Help us verify your identity by uploading a photo of your ID/KTP or
        Passport
      </Typography>

      <Box>
        <Typography>Drag &amp; Drop</Typography>
        <Typography>or select files from device max. 2MB</Typography>
        <Button>Upload</Button>
      </Box>
    </Stack>
  );
};

export default IdVerificationForm;
