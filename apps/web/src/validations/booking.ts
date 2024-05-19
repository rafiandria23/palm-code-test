import _ from 'lodash';
import { object, any, string, number } from 'zod';
import validator from 'validator';
import dayjs from 'dayjs';
import { extname } from 'path';

import type { SupportedFileType } from '../interfaces/file';
import { SUPPORTED_FILE_TYPE, MEGABYTE } from '../constants/file';

export const CreateBookingValidationSchema = object({
  name: string({
    required_error: 'Name must not be empty!',
    invalid_type_error: 'Name is invalid!',
  })
    .trim()
    .min(2, 'Name must not be empty!'),
  email: string({
    required_error: 'Email must not be empty!',
    invalid_type_error: 'Email is invalid!',
  })
    .trim()
    .email('Email is invalid!'),
  phone: string({
    required_error: 'Phone must not be empty!',
    invalid_type_error: 'Phone is invalid!',
  })
    .trim()
    .refine((value?: string) => {
      if (!value) {
        return false;
      }

      return validator.isMobilePhone(value, 'any', {
        strictMode: true,
      });
    }, 'Phone is invalid!'),
  country_id: string({
    required_error: 'Country must not be empty!',
    invalid_type_error: 'Country is invalid!',
  })
    .trim()
    .uuid('Country is invalid!'),
  surfing_experience: number({
    required_error: 'Surfing experience must not be empty!',
    invalid_type_error: 'Surfing experience is invalid!',
  })
    .min(0, 'Surfing experience must be between 0 and 10!')
    .max(10, 'Surfing experience must be between 0 and 10!'),
  date: string({
    required_error: 'Date must not be empty!',
    invalid_type_error: 'Date is invalid!',
  })
    .trim()
    .refine((value?: string) => {
      if (!value) {
        return false;
      }

      const parsedDate = dayjs(value, 'YYYY-MM-DD');

      return parsedDate.isValid();
    }, 'Date is invalid!')
    .refine((value?: string) => {
      if (!value) {
        return false;
      }

      const parsedDate = dayjs(value, 'YYYY-MM-DD');

      return parsedDate.isAfter(dayjs(), 'date');
    }, 'Date must be at least tomorrow!'),
  surfboard_id: string({
    required_error: 'Surfboard must not be empty!',
    invalid_type_error: 'Surfboard is invalid!',
  })
    .trim()
    .uuid('Surfboard is invalid!'),
  national_id_photo: any({
    required_error: 'National ID photo must not be empty!',
    invalid_type_error: 'National ID photo is invalid!',
  })
    .refine((value?: File) => {
      if (!value) {
        return false;
      }

      const extension = extname(value.name);
      const mimeType = _.find(SUPPORTED_FILE_TYPE.image, {
        mimeType: value.type,
      });

      return _.get<SupportedFileType, 'extensions', string[]>(
        mimeType,
        'extensions',
        [],
      ).includes(extension.toLowerCase());
    }, 'File format must be one of PNG, JPEG, and JPG!')
    .refine((value?: File) => {
      if (!value) {
        return false;
      }

      return value.size <= 2 * MEGABYTE;
    }, 'File size must not exceed 2MB!'),
});
