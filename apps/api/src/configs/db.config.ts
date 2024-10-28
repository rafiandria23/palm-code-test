import _ from 'lodash';
import { registerAs } from '@nestjs/config';

import { RADIX } from '../common/common.constant';

export const dbConfig = registerAs('db', () => {
  return {
    ssl: _.defaultTo(process.env.DB_SSL, 'false'),
    host: _.defaultTo(process.env.DB_HOST, 'localhost'),
    port: _.defaultTo(parseInt(process.env.DB_PORT, RADIX), 5432),
    user: _.defaultTo(process.env.DB_USER, 'palm_code'),
    pass: _.defaultTo(process.env.DB_PASS, 'palm_code'),
    name: _.defaultTo(process.env.DB_NAME, 'palm_code'),
  };
});
