'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Doctors', [
      {
        name: 'John Doe',
        specialty: 'Dentist',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Schmitty Footman',
        specialty: 'Podiatrist',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
      .then(() => {
        return queryInterface.bulkInsert('Patients', [
          {
            name: 'Patient 1',
            createdAt: new Date(),
            updatedAt: new Date()
          }, {
            name: 'Patient 2',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ], {})
      })
      .then(() => {
        return queryInterface.bulkInsert('Appointments', [
          {
            reason: 'Teeth stuff',
            doctorId: 1,
            patientId: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            reason: 'Foot stuff',
            doctorId: 2,
            patientId: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ], {})
      })
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
