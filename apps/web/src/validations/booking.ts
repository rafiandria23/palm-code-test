import _ from 'lodash';
import * as z from 'zod';
import validator from 'validator';
import dayjs from 'dayjs';
import { extname } from 'node:path';

import type { SupportedFileType } from '../interfaces/file';
import { SUPPORTED_FILE_TYPE, MEGABYTE } from '../constants/file';

export const CreateBookingValidationSchema = z.object({
  name: z
    .string({
      error: 'Name is invalid',
    })
    .trim()
    .min(2, 'Name must be at least 2 characters long'),
  email: z.email({
    error: 'Email is invalid',
  }),
  phone: z
    .string({
      error: 'Phone is invalid',
    })
    .refine((value?: string) => {
      if (!value) {
        return false;
      }

      return validator.isMobilePhone(value, 'any', {
        strictMode: true,
      });
    }, 'Phone is invalid'),
  country_id: z.uuid({
    error: 'Country is invalid',
  }),
  surfing_experience: z
    .number({
      error: 'Surfing experience is invalid',
    })
    .min(0, 'Surfing experience must be between 0 and 10')
    .max(10, 'Surfing experience must be between 0 and 10'),
  date: z
    .date({
      error: 'Date is invalid',
    })
    .min(dayjs().add(1, 'day').toDate(), 'Date must be at least tomorrow'),
  surfboard_id: z.uuid({
    error: 'Surfboard is invalid',
  }),
  national_id_photo: z
    .any()
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
    }, 'File format must be one of PNG, JPEG, or JPG')
    .refine((value?: File) => {
      if (!value) {
        return false;
      }

      return value.size <= 2 * MEGABYTE;
    }, 'File size must not exceed 2MB'),
});
