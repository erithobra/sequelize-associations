'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Fruits', [
      {
          name:'apple',
          color: 'red',
          readyToEat: true,
          createdAt: new Date(),
          updatedAt: new Date()
      },
      {
          name:'pear',
          color: 'green',
          readyToEat: false,
          createdAt: new Date(),
          updatedAt: new Date()
      },
      {
          name:'banana',
          color: 'yellow',
          readyToEat: true,
          createdAt: new Date(),
          updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
