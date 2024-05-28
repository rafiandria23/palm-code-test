'use strict';

const extensionName = 'uuid-ossp';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `CREATE EXTENSION IF NOT EXISTS "${extensionName}"`,
        { transaction },
      );
    });
  },
  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `DROP EXTENSION "${extensionName}"`,
        { transaction },
      );
    });
  },
};
