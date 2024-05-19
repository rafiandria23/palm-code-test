'use client';

import type { FC, ReactNode, CSSProperties } from 'react';
import { useTheme, SliderMarkLabel, Typography } from '@mui/material';

export interface SurfboardSliderMarkLabelProps {
  markLabelActive: boolean;
  children: ReactNode;
  style: CSSProperties;
}

const SurfboardSliderMarkLabel: FC<SurfboardSliderMarkLabelProps> = ({
  children,
  ...props
}) => {
  const theme = useTheme();

  return (
    <SliderMarkLabel
      {...props}
      style={{
        ...props.style,
        top: props.markLabelActive ? theme.spacing(-5) : theme.spacing(-4),
        transition: 'top 0.2s ease-in-out',
      }}
    >
      <Typography
        variant={props.markLabelActive ? 'body1' : 'body2'}
        sx={{
          fontWeight: props.markLabelActive ? 'bold' : 'normal',
        }}
      >
        {children}
      </Typography>
    </SliderMarkLabel>
  );
};

export default SurfboardSliderMarkLabel;
