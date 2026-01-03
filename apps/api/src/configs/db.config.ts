import _ from 'lodash';
import { registerAs } from '@nestjs/config';

import { RADIX } from '../common/common.constant';

export const dbConfigs = registerAs('db', () => {
  return {
    ssl: _.defaultTo(process.env.DB_SSL, 'false'),
    host: _.defaultTo(process.env.DB_HOST, '127.0.0.1'),
    port: _.defaultTo(Number.parseInt(process.env.DB_PORT, RADIX), 5432),
    user: _.defaultTo(process.env.DB_USER, 'palm_code'),
    password: _.defaultTo(process.env.DB_PASSWORD, 'palm_code'),
    name: _.defaultTo(process.env.DB_NAME, 'palm_code'),
  };
});
