import dayjs from 'dayjs';
import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function IsDate(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateInFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const parsedDate = dayjs(value, 'YYYY-MM-DD', true);

          if (!parsedDate.isValid()) {
            return false;
          }

          return parsedDate.isAfter(dayjs(), 'date');
        },
      },
    });
  };
}
