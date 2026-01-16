import type { FC, ReactNode, ImgHTMLAttributes } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { faker } from '@faker-js/faker';
import { filesize } from 'filesize';
import dayjs from 'dayjs';

import { Country, Surfboard } from '../interfaces/setting';
import {
  Booking,
  BookingState,
  CreateBookingFormPayload,
} from '../interfaces/booking';
import { SUPPORTED_FILE_TYPE } from '../constants/file';
import { CreateBookingValidationSchema } from '../validations/booking';
import { useAppSelector } from '../hooks/store';
import NationalIdVerificationForm from './NationalIdVerificationForm';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt} />
  ),
}));

jest.mock('../assets/file.svg', () => 'file-icon');
jest.mock('../assets/close.svg', () => 'close-icon');

jest.mock('../hooks/store', () => ({
  useAppSelector: jest.fn(),
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

describe('NationalIdVerificationForm', () => {
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
        <NationalIdVerificationForm />
      </Wrapper>,
    );

    const nationalIdPhotoInput = screen.getByTestId('national_id_photo-input');

    expect(nationalIdPhotoInput).toBeInTheDocument();
  });

  it('should render and handle upload via manual input', async () => {
    render(
      <Wrapper>
        <NationalIdVerificationForm />
      </Wrapper>,
    );

    const nationalIdPhotoInput = screen.getByTestId('national_id_photo-input');

    expect(nationalIdPhotoInput).toBeInTheDocument();

    await userEvent.upload(nationalIdPhotoInput, nationalIdPhotoFileMock);

    const nationalIdPhotoFilename = screen.getByText(
      new RegExp(nationalIdPhotoFileMock.name, 'i'),
    );
    const nationalIdPhotoFileSize = screen.getByText(
      new RegExp(filesize(nationalIdPhotoFileMock.size), 'i'),
    );

    expect(nationalIdPhotoFilename).toBeInTheDocument();
    expect(nationalIdPhotoFileSize).toBeInTheDocument();
  });

  it('should render and handle upload via drag and drop', () => {
    render(
      <Wrapper>
        <NationalIdVerificationForm />
      </Wrapper>,
    );

    const nationalIdPhotoDropZone = screen.getByTestId(
      'national_id_photo-drop-zone',
    );

    expect(nationalIdPhotoDropZone).toBeInTheDocument();

    fireEvent.dragOver(nationalIdPhotoDropZone);
    fireEvent.drop(nationalIdPhotoDropZone, {
      dataTransfer: {
        files: [nationalIdPhotoFileMock],
      },
    });

    const nationalIdPhotoFilename = screen.getByText(
      new RegExp(nationalIdPhotoFileMock.name, 'i'),
    );
    const nationalIdPhotoFileSize = screen.getByText(
      new RegExp(filesize(nationalIdPhotoFileMock.size), 'i'),
    );

    expect(nationalIdPhotoFilename).toBeInTheDocument();
    expect(nationalIdPhotoFileSize).toBeInTheDocument();
  });

  it('should render and prevent handling upload via drag and drop when loading', () => {
    useAppSelectorMock.mockImplementation((selector) =>
      selector({
        booking: {
          ...bookingStateMock,
          loading: true,
        },
      }),
    );

    render(
      <Wrapper>
        <NationalIdVerificationForm />
      </Wrapper>,
    );

    const nationalIdPhotoDropZone = screen.getByTestId(
      'national_id_photo-drop-zone',
    );

    expect(nationalIdPhotoDropZone).toBeInTheDocument();

    fireEvent.dragOver(nationalIdPhotoDropZone);
    fireEvent.drop(nationalIdPhotoDropZone, {
      dataTransfer: {
        files: [nationalIdPhotoFileMock],
      },
    });

    const nationalIdPhotoFilename = screen.queryByText(
      new RegExp(nationalIdPhotoFileMock.name, 'i'),
    );
    const nationalIdPhotoFileSize = screen.queryByText(
      new RegExp(filesize(nationalIdPhotoFileMock.size), 'i'),
    );

    expect(nationalIdPhotoFilename).not.toBeInTheDocument();
    expect(nationalIdPhotoFileSize).not.toBeInTheDocument();
  });

  it('should render and handle clearing upload', async () => {
    render(
      <Wrapper>
        <NationalIdVerificationForm />
      </Wrapper>,
    );

    const nationalIdPhotoInput = screen.getByTestId('national_id_photo-input');

    expect(nationalIdPhotoInput).toBeInTheDocument();

    await userEvent.upload(nationalIdPhotoInput, nationalIdPhotoFileMock);

    const nationalIdPhotoFilename = screen.getByText(
      new RegExp(nationalIdPhotoFileMock.name, 'i'),
    );
    const nationalIdPhotoFileSize = screen.getByText(
      new RegExp(filesize(nationalIdPhotoFileMock.size), 'i'),
    );

    expect(nationalIdPhotoFilename).toBeInTheDocument();
    expect(nationalIdPhotoFileSize).toBeInTheDocument();

    const clearButton = screen.getByTestId('clear-national_id_photo-button');

    expect(clearButton).toBeInTheDocument();

    await userEvent.click(clearButton);

    expect(nationalIdPhotoFilename).not.toBeInTheDocument();
    expect(nationalIdPhotoFileSize).not.toBeInTheDocument();
    expect(clearButton).not.toBeInTheDocument();
  });
});
