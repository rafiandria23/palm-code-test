import { render } from '@testing-library/react';
import { faker } from '@faker-js/faker';

import SurfboardSliderMarkLabel from './SurfboardSliderMarkLabel';

describe('SurfboardSliderMarkLabel', () => {
  it('should render with active mark label', () => {
    const { container } = render(
      <SurfboardSliderMarkLabel markLabelActive={true} style={{}}>
        {faker.lorem.word()}
      </SurfboardSliderMarkLabel>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with inactive mark label', () => {
    const { container } = render(
      <SurfboardSliderMarkLabel markLabelActive={false} style={{}}>
        {faker.lorem.word()}
      </SurfboardSliderMarkLabel>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
