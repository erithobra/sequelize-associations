'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Seasons', [
      {
        name: 'Summer'
      },
      {
        name: 'Winter'
      },
      {
        name: 'Spring'
      },
      {
        name: 'Autumn'
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
