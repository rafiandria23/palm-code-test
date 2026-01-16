import type { FC, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
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
import { CreateBookingValidationSchema } from '../validations/booking';
import { useAppSelector } from '../hooks/store';
import settingApi from '../services/setting';
import VisitorDetailsForm from './VisitorDetailsForm';

jest.mock('../hooks/store', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('../services/setting', () => ({
  useReadAllCountriesQuery: jest.fn(),
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

  return <FormProvider {...form}>{children}</FormProvider>;
};

describe('VisitorDetailsForm', () => {
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

  const countriesMock: Country[] = [
    countryMock,
    {
      id: faker.string.uuid(),

      name: faker.location.country(),
      code: faker.location.countryCode(),
      dial_code: `+${faker.number.int({ min: 1, max: 999 })}`,
      emoji: faker.internet.emoji(),

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

    settingApiMock.useReadAllCountriesQuery.mockReturnValue({
      data: { data: countriesMock },
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

  it('should render', async () => {
    render(
      <Wrapper>
        <VisitorDetailsForm />
      </Wrapper>,
    );

    const nameInput = screen.getByTestId('name-input');
    const countryInput = screen.getByTestId('country_id-input');
    const emailInput = screen.getByTestId('email-input');
    const phoneInput = screen.getByTestId('phone-input');

    expect(nameInput).toBeInTheDocument();
    expect(countryInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
  });

  it('it should render and handle clearing fields', async () => {
    render(
      <Wrapper>
        <VisitorDetailsForm />
      </Wrapper>,
    );

    const nameInput = screen
      .getByTestId('name-input')
      .querySelector('input') as HTMLInputElement;
    const countryInput = screen
      .getByTestId('country_id-input')
      .querySelector('input') as HTMLInputElement;
    const emailInput = screen
      .getByTestId('email-input')
      .querySelector('input') as HTMLInputElement;
    const phoneInput = screen
      .getByTestId('phone-input')
      .querySelector('input') as HTMLInputElement;

    expect(nameInput).toBeInTheDocument();
    expect(countryInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();

    await userEvent.click(nameInput);
    await userEvent.type(nameInput, bookingMock.name);

    await userEvent.click(countryInput);
    await userEvent.type(countryInput, bookingMock.country.name);
    await userEvent.click(
      screen.getByText(
        new RegExp(
          String.raw`${bookingMock.country.emoji}\s*${bookingMock.country.name}`,
          'i',
        ),
      ),
    );

    await userEvent.click(emailInput);
    await userEvent.type(emailInput, bookingMock.email);

    await userEvent.click(phoneInput);
    await userEvent.type(phoneInput, bookingMock.phone);

    expect(nameInput.value).toEqual(bookingMock.name);
    expect(countryInput.value).toMatch(
      new RegExp(
        String.raw`${bookingMock.country.emoji}\s*${bookingMock.country.name}`,
        'i',
      ),
    );
    expect(emailInput.value).toEqual(bookingMock.email);
    expect(phoneInput.value).toEqual(bookingMock.phone);

    await userEvent.click(countryInput);
    await userEvent.clear(countryInput);
    await userEvent.type(countryInput, countriesMock[1].name);
    await userEvent.click(
      screen.getByText(
        new RegExp(
          String.raw`${countriesMock[1].emoji}\s*${countriesMock[1].name}`,
          'i',
        ),
      ),
    );

    expect(countryInput.value).toMatch(
      new RegExp(
        String.raw`${countriesMock[1].emoji}\s*${countriesMock[1].name}`,
        'i',
      ),
    );

    const clearButtons = screen.getAllByTestId(/^clear-.*-button$/);

    for (const clearButton of clearButtons) {
      await userEvent.click(clearButton);
    }

    expect(nameInput.value).toBeFalsy();
    expect(countryInput.value).toBeFalsy();
    expect(emailInput.value).toBeFalsy();
    expect(phoneInput.value).toBeFalsy();
  });
});
