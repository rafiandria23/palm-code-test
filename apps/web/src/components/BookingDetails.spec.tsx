import { render, screen, act } from '@testing-library/react';
import dayjs, { type Dayjs } from 'dayjs';
import { faker } from '@faker-js/faker';

import type { Country, Surfboard } from '../interfaces/setting';
import type { Booking, BookingState } from '../interfaces/booking';
import { WEB_DATE_FORMAT } from '../constants/date';
import { useAppSelector } from '../hooks/store';
import BookingDetails from './BookingDetails';

jest.mock('../hooks/store', () => ({
  useAppSelector: jest.fn(),
}));

describe('BookingDetails', () => {
  const onTimeoutMock = jest.fn();
  const useAppSelectorMock = useAppSelector as jest.Mock;

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
    national_id_photo_url: faker.internet.url(),

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

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();

    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should render', () => {
    useAppSelectorMock.mockImplementation((selector) =>
      selector({
        booking: bookingStateMock,
      }),
    );

    render(<BookingDetails onTimeout={onTimeoutMock} />);

    expect(
      screen.getByText(new RegExp(bookingMock.name, 'i')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(bookingMock.country.emoji, 'i')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(bookingMock.country.name, 'i')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(bookingMock.email, 'i')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp((bookingMock.date as Dayjs).format(WEB_DATE_FORMAT), 'i'),
      ),
    ).toBeInTheDocument();
  });

  it('should render without visit date', () => {
    useAppSelectorMock.mockImplementation((selector) =>
      selector({
        booking: {
          ...bookingStateMock,
          data: null,
        },
      }),
    );

    render(<BookingDetails onTimeout={onTimeoutMock} />);

    expect(
      screen.queryByText(
        new RegExp((bookingMock.date as Dayjs).format(WEB_DATE_FORMAT), 'i'),
      ),
    ).not.toBeInTheDocument();
  });

  it('should render and handle timeout', async () => {
    useAppSelectorMock.mockImplementation((selector) =>
      selector({
        booking: bookingStateMock,
      }),
    );

    render(<BookingDetails onTimeout={onTimeoutMock} />);

    for (let i = 0; i < 11; i++) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }

    expect(onTimeoutMock).toHaveBeenCalled();
    expect(screen.getByText(/0 seconds/i)).toBeInTheDocument();
  });
});
