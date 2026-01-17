import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';

import type { Country, Surfboard } from '../interfaces/setting';
import type { CreateBookingFormPayload } from '../interfaces/booking';
import { SUPPORTED_FILE_TYPE } from '../constants/file';
import { CreateBookingValidationSchema } from './booking';

describe('CreateBookingValidationSchema', () => {
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

  const nationalIdPhotoFileTypeMock = faker.helpers.arrayElement(
    SUPPORTED_FILE_TYPE.image,
  );

  const createBookingFormPayloadMock: CreateBookingFormPayload = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: 'international' }),
    country_id: countryMock.id,
    surfing_experience: faker.number.int({ min: 0, max: 10 }),
    date: dayjs().add(1, 'day').toDate(),
    surfboard_id: surfboardMock.id,
    national_id_photo: new File(
      [faker.string.alphanumeric()],
      `${faker.string.alphanumeric()}${faker.helpers.arrayElement(nationalIdPhotoFileTypeMock.extensions)}`,
      { type: nationalIdPhotoFileTypeMock.mimeType },
    ),
  };

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should validate payload', async () => {
    const result = await CreateBookingValidationSchema.safeParseAsync(
      createBookingFormPayloadMock,
    );

    expect(result.success).toBeTruthy();
  });

  it('should invalidate national ID photo', async () => {
    const result = await CreateBookingValidationSchema.safeParseAsync({
      ...createBookingFormPayloadMock,
      national_id_photo: null,
    });

    expect(result.success).toBeFalsy();
  });
});
