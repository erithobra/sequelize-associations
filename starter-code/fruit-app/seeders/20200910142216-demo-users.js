'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Tony Stark",
          username: "ironman",
          password: "prettyawesome",
        },
        {
          name: "Clark Kent",
          username: "superman",
          password: "canfly",
        },
        {
          name: "Bruce Wayne",
          username: "batman",
          password: "hasgadgets",
        },
      ],
      {}
    );
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
