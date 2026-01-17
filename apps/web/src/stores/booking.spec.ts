import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';

import type { Country, Surfboard } from '../interfaces/setting';
import type { Booking, BookingState } from '../interfaces/booking';
import bookingSlice from './booking';

describe('bookingSlice', () => {
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

    created_at: faker.date.past(),
    updated_at: faker.date.recent(),
    deleted_at: null,
  };

  const bookingStateMock: BookingState = {
    loading: false,
    data: bookingMock,
  };

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should handle unknown action', () => {
    const result = bookingSlice.reducer(bookingStateMock, {
      type: faker.string.alpha(),
    });

    expect(result).toEqual(bookingStateMock);
  });

  it('should handle setLoading action', () => {
    const expectedLoading = faker.datatype.boolean();

    const result = bookingSlice.reducer(
      bookingStateMock,
      bookingSlice.actions.setLoading(expectedLoading),
    );

    expect(result.loading).toEqual(expectedLoading);
  });

  it('should handle setData', () => {
    const expectedData = {
      ...bookingMock,
      date: dayjs().add(2, 'days'),
    };

    const result = bookingSlice.reducer(
      bookingStateMock,
      bookingSlice.actions.setData(expectedData),
    );

    expect(result.data).toEqual(expectedData);
  });
});
