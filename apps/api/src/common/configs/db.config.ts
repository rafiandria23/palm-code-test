import _ from 'lodash';
import { registerAs } from '@nestjs/config';

import { RADIX } from '../constants';

export const dbConfig = registerAs('db', () => {
  return {
    host: _.defaultTo(process.env.DB_HOST, '127.0.0.1'),
    port: _.defaultTo(parseInt(process.env.DB_PORT, RADIX), 5432),
    user: _.defaultTo(process.env.DB_USER, 'palm_code'),
    pass: _.defaultTo(process.env.DB_PASS, 'palm_code'),
    name: _.defaultTo(process.env.DB_NAME, 'palm_code'),
  };
});
