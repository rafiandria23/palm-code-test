require('dotenv').config();

const _ = require('lodash');

const RADIX = 10;

/** @type {import('sequelize').Options['dialect']} */
const dialect = 'postgres';

/** @type {import('sequelize').Options} */
const defaultConfig = {
  dialect,
  dialectOptions: {
    ssl:
      _.defaultTo(process.env.DB_SSL, 'false') === 'true'
        ? {
            require: true,
            rejectUnauthorized: true,
          }
        : undefined,
  },
  host: _.defaultTo(process.env.DB_HOST, 'localhost'),
  port: _.defaultTo(parseInt(process.env.DB_PORT, RADIX), 5432),
  username: _.defaultTo(process.env.DB_USER, 'palm_code'),
  password: _.defaultTo(process.env.DB_PASSWORD, 'palm_code'),
  database: _.defaultTo(process.env.DB_NAME, 'palm_code'),
};

/** @type {Record<'development' | 'test' | 'production', import('sequelize').Options>} */
const configs = {
  development: defaultConfig,
  test: defaultConfig,
  production: defaultConfig,
};

module.exports = configs;
