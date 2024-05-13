'use strict';

const tableName = 'bookings';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      visitor_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      visitor_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      visitor_phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      visitor_country_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      surfing_experience: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      visit_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      surfboard_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      national_id_photo_file_key: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};
