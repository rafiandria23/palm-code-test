import { render } from '@testing-library/react';

import SurfboardSliderThumb from './SurfboardSliderThumb';

describe('SurfboardSliderThumb', () => {
  it('should render', () => {
    const { container } = render(
      <SurfboardSliderThumb>
        <div>Surfboard Slider Thumb Children</div>
      </SurfboardSliderThumb>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
