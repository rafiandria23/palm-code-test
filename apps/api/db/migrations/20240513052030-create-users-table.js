'use strict';

const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        tableName,
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
          },
          first_name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          last_name: {
            type: Sequelize.STRING,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          deleted_at: {
            type: Sequelize.DATE,
          },
        },
        {
          transaction,
        },
      );
    });
  },
  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable(tableName, { transaction });
    });
  },
};
