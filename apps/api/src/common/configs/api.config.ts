import _ from 'lodash';
import { registerAs } from '@nestjs/config';

import { RADIX } from '../constants';

export const apiConfig = registerAs('api', () => ({
  host: _.defaultTo(process.env.API_HOST, 'localhost'),
  port: _.defaultTo(parseInt(process.env.API_PORT, RADIX), 4000),
}));
