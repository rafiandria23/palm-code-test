import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import BookingForm from './BookingForm';
import { useAppSelector, useAppDispatch } from '../hooks/store';
import { CreateBookingValidationSchema } from '../validations/booking';
import settingApi from '../services/setting';

jest.mock('../hooks/store', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock('../services/setting', () => ({
  useReadAllCountriesQuery: jest.fn(),
  useReadAllSurfboardsQuery: jest.fn(),
}));

jest.mock('./BookingDetails', () => {
  return function MockBookingDetails({ onTimeout }: { onTimeout: () => void }) {
    return (
      <div data-testid="booking-details">
        <button onClick={onTimeout}>Timeout</button>
      </div>
    );
  };
});

// Mock next/image and assets
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        {...props}
        src={typeof props.src === 'string' ? props.src : 'mocked-url'}
        alt={props.alt}
      />
    );
  },
}));

jest.mock('../assets/file.svg', () => 'file-icon');
jest.mock('../assets/close.svg', () => 'close-icon');

const Wrapper = ({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: any;
}) => {
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(CreateBookingValidationSchema),
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormProvider {...methods}>{children}</FormProvider>
    </LocalizationProvider>
  );
};

describe('BookingForm', () => {
  const onSubmitMock = jest.fn();
  const dispatchMock = jest.fn();
  const useAppSelectorMock = useAppSelector as jest.Mock;
  const useAppDispatchMock = useAppDispatch as jest.Mock;
  const useReadAllCountriesQueryMock =
    settingApi.useReadAllCountriesQuery as jest.Mock;
  const useReadAllSurfboardsQueryMock =
    settingApi.useReadAllSurfboardsQuery as jest.Mock;

  const mockCountries = [
    { id: faker.string.uuid(), name: 'Indonesia', emoji: '🇮🇩' },
    { id: faker.string.uuid(), name: 'United States', emoji: '🇺🇸' },
  ];

  const mockSurfboards = [
    { id: faker.string.uuid(), name: 'Longboard' },
    { id: faker.string.uuid(), name: 'Shortboard' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAppDispatchMock.mockReturnValue(dispatchMock);
    useAppSelectorMock.mockReturnValue({
      loading: false,
      data: null,
    });
    useReadAllCountriesQueryMock.mockReturnValue({
      data: { data: mockCountries },
      isLoading: false,
    });
    useReadAllSurfboardsQueryMock.mockReturnValue({
      data: { data: mockSurfboards },
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders initial step (Visitor Details)', () => {
    render(
      <Wrapper>
        <BookingForm onSubmit={onSubmitMock} />
      </Wrapper>,
    );

    expect(screen.getByText(/Book Your Visit/i)).toBeInTheDocument();
    expect(screen.getByText(/1\/3/)).toBeInTheDocument();
  });

  it('navigates through steps and handles reset', async () => {
    const defaultValues = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: `+62${faker.string.numeric(10)}`,
      country_id: mockCountries[0].id,
      surfing_experience: faker.number.int({ min: 0, max: 10 }),
      date: dayjs().add(2, 'day').toDate(),
      surfboard_id: mockSurfboards[0].id,
      national_id_photo: new File([''], 'test.png', { type: 'image/png' }),
    };

    const { rerender } = render(
      <Wrapper defaultValues={defaultValues}>
        <BookingForm onSubmit={onSubmitMock} />
      </Wrapper>,
    );

    // Step 1 -> Step 2
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    expect(screen.getByText(/2\/3/)).toBeInTheDocument();

    // Step 2 -> Step 3
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    expect(screen.getByText(/3\/3/)).toBeInTheDocument();

    // Step 3 -> Submission
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Book My Visit/i }));
    });

    expect(onSubmitMock).toHaveBeenCalled();

    // Mock finished state
    useAppSelectorMock.mockReturnValue({
      loading: false,
      data: { name: defaultValues.name },
    });

    rerender(
      <Wrapper defaultValues={defaultValues}>
        <BookingForm onSubmit={onSubmitMock} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('booking-details')).toBeInTheDocument();
    });

    // Trigger handleReset
    fireEvent.click(screen.getByRole('button', { name: /Timeout/i }));

    await waitFor(() => {
      expect(screen.getByText(/1\/3/)).toBeInTheDocument();
    });
  });

  it('handles invalid form submission', async () => {
    render(
      <Wrapper defaultValues={{ name: '' }}>
        <BookingForm onSubmit={onSubmitMock} />
      </Wrapper>,
    );

    // Try to go to next step
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    });

    // Should still be on step 1 because validation failed
    expect(screen.getByText(/1\/3/)).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('disables button when loading', () => {
    useAppSelectorMock.mockReturnValue({
      loading: true,
      data: null,
    });

    render(
      <Wrapper>
        <BookingForm onSubmit={onSubmitMock} />
      </Wrapper>,
    );

    expect(screen.getByRole('button', { name: /Next/i })).toBeDisabled();
  });
});
