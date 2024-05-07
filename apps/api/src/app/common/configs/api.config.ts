import _ from 'lodash';
import { registerAs } from '@nestjs/config';

export const apiConfig = registerAs('api', () => ({
  host: _.defaultTo(process.env.API_HOST, '0.0.0.0'),
  port: _.defaultTo(parseInt(process.env.API_PORT, 10), 4000),
}));
