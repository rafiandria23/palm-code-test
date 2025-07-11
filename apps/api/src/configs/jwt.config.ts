import _ from 'lodash';
import { registerAs } from '@nestjs/config';

export const jwtConfigs = registerAs('jwt', () => {
  return {
    secret: _.defaultTo(process.env.JWT_SECRET, 'palm-code'),
  };
});
