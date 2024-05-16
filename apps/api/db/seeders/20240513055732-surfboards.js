'use strict';

const uuid = require('uuid');

const tableName = 'surfboards';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const surfboards = [
      {
        name: 'Longboard',
      },
      {
        name: 'Funboard',
      },
      {
        name: 'Shortboard',
      },
      {
        name: 'Fishboard',
      },
      {
        name: 'Gunboard',
      },
    ];

    await queryInterface.bulkInsert(
      tableName,
      surfboards.map((surfboard) => ({
        id: uuid.v4(),
        ...surfboard,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      })),
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, null);
  },
};
