import _ from 'lodash';
import { registerAs } from '@nestjs/config';

import { RADIX } from '../common/common.constant';

export const apiConfigs = registerAs('api', () => ({
  host: _.defaultTo(process.env.API_HOST, '127.0.0.1'),
  port: _.defaultTo(Number.parseInt(process.env.API_PORT, RADIX), 4000),
}));
