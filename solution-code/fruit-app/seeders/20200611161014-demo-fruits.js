'use strict';

const { query } = require("express");

module.exports = {
  up: (queryInterface, Sequelize) => {//up method will run when we run seeder file
    return queryInterface.bulkInsert('Fruits', [
      {
        name:'apple',
        color: 'red',
        readyToEat: true,
        userId: 1
      },
      {
        name:'pear',
        color: 'green',
        readyToEat: false,
        userId: 2
      },
      {
        name:'banana',
        color: 'yellow',
        readyToEat: true,
        userId: 3
      }
    ])
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {//undo
    return queryInterface.bulkDelete('Fruits', null, {});
  }
};
