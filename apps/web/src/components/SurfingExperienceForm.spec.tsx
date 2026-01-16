import type { FC, ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import { Country, Surfboard } from '../interfaces/setting';
import {
  Booking,
  BookingState,
  CreateBookingFormPayload,
} from '../interfaces/booking';
import { WEB_DATE_FORMAT } from '../constants/date';
import { CreateBookingValidationSchema } from '../validations/booking';
import { useAppSelector } from '../hooks/store';
import settingApi from '../services/setting';
import DatePickersProvider from './DatePickersProvider';
import SurfingExperienceForm from './SurfingExperienceForm';

jest.mock('../hooks/store', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('../services/setting', () => ({
  useReadAllSurfboardsQuery: jest.fn(),
}));

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: FC<WrapperProps> = ({ children }) => {
  const form = useForm<CreateBookingFormPayload>({
    mode: 'onBlur',
    resolver: zodResolver(CreateBookingValidationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country_id: '',
      surfing_experience: 0,
      date: null as unknown as Date,
      surfboard_id: '',
      national_id_photo: null as unknown as File,
    },
  });

  return (
    <DatePickersProvider>
      <FormProvider {...form}>{children}</FormProvider>
    </DatePickersProvider>
  );
};

describe('SurfingExperienceForm', () => {
  const useAppSelectorMock = useAppSelector as jest.Mock;
  const settingApiMock = settingApi as jest.Mocked<typeof settingApi>;

  const countryMock: Country = {
    id: faker.string.uuid(),

    name: faker.location.country(),
    code: faker.location.countryCode(),
    dial_code: `+${faker.number.int({ min: 1, max: 999 })}`,
    emoji: faker.internet.emoji(),

    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    deleted_at: null,
  };

  const surfboardMock: Surfboard = {
    id: faker.string.uuid(),

    name: faker.lorem.word(),

    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    deleted_at: null,
  };

  const bookingMock: Booking = {
    id: faker.string.uuid(),

    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: 'international' }),
    country_id: countryMock.id,
    surfing_experience: faker.number.int({ min: 0, max: 10 }),
    date: dayjs().add(1, 'day'),
    surfboard_id: surfboardMock.id,
    national_id_photo_url: '',
    country: countryMock,
    surfboard: surfboardMock,

    created_at: dayjs(),
    updated_at: dayjs(),
    deleted_at: null,
  };

  const bookingStateMock: BookingState = {
    loading: false,
    data: bookingMock,
  };

  const surfboardsMock: Surfboard[] = [
    surfboardMock,
    {
      id: faker.string.uuid(),

      name: faker.lorem.word(),

      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      deleted_at: null,
    },
  ];

  beforeEach(() => {
    useAppSelectorMock.mockImplementation((selector) =>
      selector({
        booking: bookingStateMock,
      }),
    );

    settingApiMock.useReadAllSurfboardsQuery.mockReturnValue({
      data: { data: surfboardsMock },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should render', () => {
    render(
      <Wrapper>
        <SurfingExperienceForm />
      </Wrapper>,
    );

    const surfingExperienceSlider = screen.getByTestId(
      'surfing_experience-slider',
    );
    const dateInput = screen.getByTestId('date-input');
    const surfboardInput = screen.getByTestId('surfboard_id-input');

    expect(surfingExperienceSlider).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
    expect(surfboardInput).toBeInTheDocument();
  });

  it('should render and handle sliding', async () => {
    render(
      <Wrapper>
        <SurfingExperienceForm />
      </Wrapper>,
    );

    const surfingExperienceSlider = screen.getByTestId(
      'surfing_experience-slider',
    );
    const surfingExperienceSliderThumb = within(
      surfingExperienceSlider,
    ).getByTestId('surfing_experience-slider-thumb');

    await userEvent.tab();
    await userEvent.keyboard('[ArrowRight]');

    const surfingExperienceInput = surfingExperienceSliderThumb.querySelector(
      'input',
    ) as HTMLInputElement;

    expect(Number(surfingExperienceInput.value)).toEqual(1);
  });

  it('should render and handle clearing fields', async () => {
    render(
      <Wrapper>
        <SurfingExperienceForm />
      </Wrapper>,
    );

    const tomorrow = dayjs().add(1, 'day');
    const dayAfterTomorrow = tomorrow.add(1, 'day');

    const dateInput = screen
      .getByTestId('date-input')
      .querySelector('input') as HTMLInputElement;
    const openDatePickerButton = screen.getByTestId(
      'open-date-date-picker-button',
    );
    const surfboardInput = screen
      .getByTestId('surfboard_id-input')
      .querySelector('input') as HTMLInputElement;

    expect(dateInput).toBeInTheDocument();
    expect(openDatePickerButton).toBeInTheDocument();
    expect(surfboardInput).toBeInTheDocument();

    await userEvent.click(openDatePickerButton);
    await userEvent.click(
      screen.getByRole('gridcell', {
        name: tomorrow.get('date').toString(),
      }),
    );

    await userEvent.click(surfboardInput);
    await userEvent.type(surfboardInput, bookingMock.surfboard.name);
    await userEvent.click(screen.getByText(bookingMock.surfboard.name));

    expect(dateInput.value).toEqual(tomorrow.format(WEB_DATE_FORMAT));
    expect(surfboardInput.value).toEqual(bookingMock.surfboard.name);

    await userEvent.click(dateInput);
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, dayAfterTomorrow.format(WEB_DATE_FORMAT));

    await userEvent.click(surfboardInput);
    await userEvent.clear(surfboardInput);
    await userEvent.type(surfboardInput, surfboardsMock[1].name);
    await userEvent.click(screen.getByText(surfboardsMock[1].name));

    expect(dateInput.value).toEqual(dayAfterTomorrow.format(WEB_DATE_FORMAT));
    expect(surfboardInput.value).toEqual(surfboardsMock[1].name);

    const clearButtons = screen.getAllByTestId(/^clear-.*-button$/);

    for (const clearButton of clearButtons) {
      await userEvent.click(clearButton);
    }

    expect(dateInput.value).toBeFalsy();
    expect(surfboardInput.value).toBeFalsy();
  });
});
