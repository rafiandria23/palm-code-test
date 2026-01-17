import type { FC, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { faker } from '@faker-js/faker';
import dayjs, { type Dayjs } from 'dayjs';

import { Country, Surfboard } from '../interfaces/setting';
import {
  Booking,
  BookingState,
  CreateBookingFormPayload,
} from '../interfaces/booking';
import { SUPPORTED_FILE_TYPE } from '../constants/file';
import { CreateBookingValidationSchema } from '../validations/booking';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import type { BookingDetailsProps } from './BookingDetails';
import BookingForm from './BookingForm';

jest.mock('../hooks/store', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('../services/setting', () => ({
  useReadAllCountriesQuery: jest.fn(),
  useReadAllSurfboardsQuery: jest.fn(),
}));

jest.mock('./VisitorDetailsForm', () => () => (
  <div data-testid="visitor-details-form" />
));

jest.mock('./SurfingExperienceForm', () => () => (
  <div data-testid="surfing-experience-form" />
));

jest.mock('./NationalIdVerificationForm', () => () => (
  <div data-testid="national-id-verification-form" />
));

jest.mock('./BookingDetails', () => {
  const BookingDetailsMock: FC<BookingDetailsProps> = ({ onTimeout }) => (
    <div data-testid="booking-details">
      <button data-testid="create-booking-reset-button" onClick={onTimeout} />
    </div>
  );

  return BookingDetailsMock;
});

describe('BookingForm', () => {
  const onSubmitMock = jest.fn();

  const useAppDispatchMock = useAppDispatch as jest.Mock;
  const useAppSelectorMock = useAppSelector as jest.Mock;

  const dispatchMock = jest.fn();

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

  const nationalIdPhotoFileTypeMock = faker.helpers.arrayElement(
    SUPPORTED_FILE_TYPE.image,
  );

  const nationalIdPhotoFileMock = new File(
    [faker.string.alphanumeric()],
    `${faker.string.alphanumeric()}${faker.helpers.arrayElement(nationalIdPhotoFileTypeMock.extensions)}`,
    { type: nationalIdPhotoFileTypeMock.mimeType },
  );

  const createBookingFormPayloadMock: CreateBookingFormPayload = {
    name: bookingMock.name,
    email: bookingMock.email,
    phone: bookingMock.phone,
    country_id: bookingMock.country_id,
    surfing_experience: bookingMock.surfing_experience,
    date: (bookingMock.date as Dayjs).toDate(),
    surfboard_id: bookingMock.surfboard_id,
    national_id_photo: nationalIdPhotoFileMock,
  };

  const stepsMock = [
    {
      dataTestId: 'visitor-details-form',
    },
    {
      dataTestId: 'surfing-experience-form',
    },
    {
      dataTestId: 'national-id-verification-form',
    },
    {
      dataTestId: 'booking-details',
    },
  ];

  interface WrapperProps {
    children: ReactNode;
    defaultValues?: CreateBookingFormPayload;
  }

  const Wrapper: FC<WrapperProps> = ({
    children,
    defaultValues = createBookingFormPayloadMock,
  }) => {
    const form = useForm<CreateBookingFormPayload>({
      mode: 'onBlur',
      resolver: zodResolver(CreateBookingValidationSchema),
      defaultValues,
    });

    return <FormProvider {...form}>{children}</FormProvider>;
  };

  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(dispatchMock);

    useAppSelectorMock.mockImplementation((selector) =>
      selector({
        booking: bookingStateMock,
      }),
    );
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should render', () => {
    render(
      <Wrapper>
        <BookingForm onSubmit={onSubmitMock} />
      </Wrapper>,
    );

    const visitorDetailsForm = screen.getByTestId('visitor-details-form');

    expect(visitorDetailsForm).toBeInTheDocument();
  });

  it('should render and handle step navigation', async () => {
    render(
      <Wrapper>
        <BookingForm onSubmit={onSubmitMock} />
      </Wrapper>,
    );

    const createBookingButton = screen.getByTestId('create-booking-button');

    expect(createBookingButton).toBeInTheDocument();

    for (const stepMock of stepsMock) {
      expect(screen.getByTestId(stepMock.dataTestId)).toBeInTheDocument();

      await userEvent.click(createBookingButton);
    }

    expect(onSubmitMock).toHaveBeenCalled();
  });

  it('should render and handle reset', async () => {
    render(
      <Wrapper>
        <BookingForm onSubmit={onSubmitMock} />
      </Wrapper>,
    );

    const createBookingButton = screen.getByTestId('create-booking-button');

    expect(createBookingButton).toBeInTheDocument();

    for (const stepMock of stepsMock) {
      expect(screen.getByTestId(stepMock.dataTestId)).toBeInTheDocument();

      await userEvent.click(createBookingButton);
    }

    expect(onSubmitMock).toHaveBeenCalled();

    const createBookingResetButton = screen.getByTestId(
      'create-booking-reset-button',
    );

    expect(createBookingResetButton).toBeInTheDocument();

    await userEvent.click(createBookingResetButton);

    expect(dispatchMock).toHaveBeenCalled();
  });

  it('should render and handle validation', async () => {
    render(
      <Wrapper
        defaultValues={{
          ...createBookingFormPayloadMock,
          name: '',
        }}
      >
        <BookingForm onSubmit={onSubmitMock} />
      </Wrapper>,
    );

    const createBookingButton = screen.getByTestId('create-booking-button');

    expect(createBookingButton).toBeInTheDocument();

    await userEvent.click(createBookingButton);

    expect(onSubmitMock).not.toHaveBeenCalled();
  });
});
