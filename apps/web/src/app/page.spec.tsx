import type { ImgHTMLAttributes, FC } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useSnackbar } from 'notistack';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import { AuthState } from '../interfaces/auth';
import { Country, Surfboard } from '../interfaces/setting';
import {
  Booking,
  BookingState,
  CreateBookingFormPayload,
} from '../interfaces/booking';
import { SUPPORTED_FILE_TYPE } from '../constants/file';
import { useAppSelector, useAppDispatch } from '../hooks/store';
import authApi from '../services/auth';
import bookingApi from '../services/booking';
import type { BookingFormProps } from '../components/BookingForm';
import IndexPage from './page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt} />
  ),
}));

jest.mock('notistack', () => ({
  useSnackbar: jest.fn(),
}));

jest.mock('../assets/beach.png', () => 'beach-image');

jest.mock('../hooks/store', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('../services/auth', () => ({
  useSignUpMutation: jest.fn(),
}));

jest.mock('../services/booking', () => ({
  useUploadNationalIdPhotoMutation: jest.fn(),
  useCreateMutation: jest.fn(),
}));

const nationalIdPhotoFileTypeMock = faker.helpers.arrayElement(
  SUPPORTED_FILE_TYPE.image,
);

const nationalIdPhotoFileMock = new File(
  [faker.string.alphanumeric()],
  `${faker.string.alphanumeric()}${faker.helpers.arrayElement(nationalIdPhotoFileTypeMock.extensions)}`,
  { type: nationalIdPhotoFileTypeMock.mimeType },
);

const createBookingFormPayloadMock: CreateBookingFormPayload = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number({ style: 'international' }),
  country_id: faker.string.uuid(),
  surfing_experience: faker.number.int({ min: 0, max: 10 }),
  date: dayjs().add(1, 'day').toDate(),
  surfboard_id: faker.string.uuid(),
  national_id_photo: nationalIdPhotoFileMock,
};

jest.mock('../components/BookingForm', () => {
  const BookingFormMock: FC<BookingFormProps> = ({ onSubmit }) => (
    <div data-testid="booking-form">
      <button
        data-testid="create-booking-button"
        onClick={() => onSubmit(createBookingFormPayloadMock)}
      />
    </div>
  );

  return BookingFormMock;
});

describe('IndexPage', () => {
  const useAppDispatchMock = useAppDispatch as jest.Mock;
  const useAppSelectorMock = useAppSelector as jest.Mock;

  const useSnackbarMock = useSnackbar as jest.Mock;

  const authApiMock = authApi as jest.Mocked<typeof authApi>;
  const bookingApiMock = bookingApi as jest.Mocked<typeof bookingApi>;

  const dispatchMock = jest.fn();
  const enqueueSnackbarMock = jest.fn();
  const authSignUpMutationMock = jest.fn();
  const uploadBookingNationalIdPhotoMutationMock = jest.fn();
  const createBookingMutationMock = jest.fn();

  const authStateMock: AuthState = {
    loading: false,
    token: {
      access: faker.string.uuid(),
    },
  };

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

  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(dispatchMock);

    useAppSelectorMock.mockImplementation((selector) =>
      selector({
        auth: authStateMock,
        booking: bookingStateMock,
      }),
    );

    authApiMock.useSignUpMutation.mockReturnValue([
      authSignUpMutationMock,
      {
        data: { data: {} },
        error: null,
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: jest.fn(),
        reset: jest.fn(),
      },
    ]);
    bookingApiMock.useUploadNationalIdPhotoMutation.mockReturnValue([
      uploadBookingNationalIdPhotoMutationMock,
      {
        data: { data: {} },
        error: null,
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: jest.fn(),
        reset: jest.fn(),
      },
    ]);
    bookingApiMock.useCreateMutation.mockReturnValue([
      createBookingMutationMock,
      {
        data: { data: {} },
        error: null,
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: jest.fn(),
        reset: jest.fn(),
      },
    ]);

    useSnackbarMock.mockReturnValue({
      enqueueSnackbar: enqueueSnackbarMock,
    });

    authSignUpMutationMock.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        data: { access_token: authStateMock.token.access },
      }),
    });

    uploadBookingNationalIdPhotoMutationMock.mockReturnValue({
      unwrap: jest
        .fn()
        .mockResolvedValue({ data: { file_key: faker.string.uuid() } }),
    });

    createBookingMutationMock.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ data: bookingMock }),
    });
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it('should render', () => {
    render(<IndexPage />);

    const bookingForm = screen.getByTestId('booking-form');

    expect(bookingForm).toBeInTheDocument();
  });

  it('should render and handle signing up', () => {
    render(<IndexPage />);

    expect(authSignUpMutationMock).toHaveBeenCalled();
  });

  it('should render and handle signing up error', async () => {
    const errMock: Error = new Error(faker.string.alpha());

    authSignUpMutationMock.mockReturnValueOnce({
      unwrap: jest.fn().mockRejectedValueOnce(errMock),
    });

    render(<IndexPage />);

    await waitFor(() => {
      expect(enqueueSnackbarMock).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'error',
          message: errMock.message,
        }),
      );
    });
  });

  it('should render and handle form submission', async () => {
    render(<IndexPage />);

    const createBookingButton = screen.getByTestId('create-booking-button');

    expect(createBookingButton).toBeInTheDocument();

    await userEvent.click(createBookingButton);

    expect(uploadBookingNationalIdPhotoMutationMock).toHaveBeenCalledWith(
      nationalIdPhotoFileMock,
    );
    expect(createBookingMutationMock).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalled();
    expect(enqueueSnackbarMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'success',
      }),
    );
  });

  it('should render and handle form submission error', async () => {
    const errMock: Error = new Error(faker.string.alpha());

    uploadBookingNationalIdPhotoMutationMock.mockReturnValueOnce({
      unwrap: jest.fn().mockRejectedValueOnce(errMock),
    });

    render(<IndexPage />);

    const createBookingButton = screen.getByTestId('create-booking-button');

    expect(createBookingButton).toBeInTheDocument();

    await userEvent.click(createBookingButton);

    await waitFor(() => {
      expect(enqueueSnackbarMock).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'error',
          message: errMock.message,
        }),
      );
    });
  });

  it('should render and handle signing up loading', () => {
    useAppSelectorMock.mockImplementationOnce((selector) =>
      selector({
        auth: {
          ...authStateMock,
          token: {
            access: null,
          },
        },
        booking: bookingStateMock,
      }),
    );

    render(<IndexPage />);

    const bookingForm = screen.getByTestId('booking-form');

    expect(bookingForm).not.toBeInTheDocument();
  });
});
