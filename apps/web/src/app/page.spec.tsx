'use client';

import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import IndexPage from './page';
import { useAppSelector, useAppDispatch } from '../hooks/store';
import authApi from '../services/auth';
import bookingApi from '../services/booking';
import { useSnackbar } from 'notistack';

jest.mock('../hooks/store', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock('../services/auth', () => ({
  useSignUpMutation: jest.fn(),
}));

jest.mock('../services/booking', () => ({
  useCreateMutation: jest.fn(),
  useUploadNationalIdPhotoMutation: jest.fn(),
}));

jest.mock('notistack', () => ({
  useSnackbar: jest.fn(),
}));

jest.mock('../components/BookingForm', () => ({
  __esModule: true,
  default: ({ onSubmit }: { onSubmit: (data: any) => Promise<void> }) => (
    <button onClick={() => onSubmit({ name: 'Test' })}>Submit Booking</button>
  ),
}));

describe('IndexPage', () => {
  const dispatchMock = jest.fn();
  const signUpFn = jest.fn();
  const createFn = jest.fn();
  const uploadFn = jest.fn();
  const enqueueSnackbarMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(dispatchMock);
    (useAppSelector as jest.Mock).mockReturnValue({ token: { access: 'mock-token' }, loading: false });
    
    // Proper RTK Query mutation tuples
    (authApi.useSignUpMutation as jest.Mock).mockReturnValue([signUpFn, { isLoading: false }]);
    (bookingApi.useCreateMutation as jest.Mock).mockReturnValue([createFn, { isLoading: false }]);
    (bookingApi.useUploadNationalIdPhotoMutation as jest.Mock).mockReturnValue([uploadFn, { isLoading: false }]);
    (useSnackbar as jest.Mock).mockReturnValue({ enqueueSnackbar: enqueueSnackbarMock });
    
    // Mocks for unwrap usage
    signUpFn.mockReturnValue({ unwrap: () => Promise.resolve({ data: { access_token: 'new-token' } }) });
    createFn.mockReturnValue({ unwrap: () => Promise.resolve({ data: { name: 'Success' } }) });
    uploadFn.mockReturnValue({ unwrap: () => Promise.resolve({ data: { file_key: 'mock-key' } }) });
  });

  it('performs sign-up on mount', async () => {
    (useAppSelector as jest.Mock).mockReturnValue({ token: { access: null }, loading: false });
    render(<IndexPage />);
    expect(signUpFn).toHaveBeenCalled();
  });

  it('handles errors during sign-up (covers line 53-56)', async () => {
    signUpFn.mockReturnValue({ unwrap: () => Promise.reject({ message: 'Cloudy with a chance of failure' }) });
    (useAppSelector as jest.Mock).mockReturnValue({ token: { access: null }, loading: false });

    render(<IndexPage />);

    await waitFor(() => {
      expect(enqueueSnackbarMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'Cloudy with a chance of failure' }));
    });
  });

  it('handles form submission correctly', async () => {
    render(<IndexPage />);
    const button = screen.getByText('Submit Booking');
    fireEvent.click(button);

    await waitFor(() => {
      expect(uploadFn).toHaveBeenCalled();
      expect(createFn).toHaveBeenCalled();
      expect(enqueueSnackbarMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'Successfully created a booking!' }));
    });
  });

  it('handles creation errors (covers line 89-92)', async () => {
    createFn.mockReturnValue({ unwrap: () => Promise.reject({ message: 'Creation failed' }) });
    render(<IndexPage />);
    const button = screen.getByText('Submit Booking');
    fireEvent.click(button);

    await waitFor(() => {
      expect(enqueueSnackbarMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'Creation failed' }));
    });
  });
});
