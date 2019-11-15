'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING
  }, {});
  Patient.associate = function (models) {
    Patient.belongsToMany(models.Doctor, { through: 'Appointments', foreignKey: 'patientId' })
    Patient.hasMany(models.Appointment, { foreignKey: 'patientId' })
  };
  return Patient;
};