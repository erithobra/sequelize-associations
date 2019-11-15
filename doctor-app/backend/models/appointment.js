'use strict';
module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    reason: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER
  }, {});
  Appointment.associate = function (models) {
    // Appointment.hasMany(models.Patient)
    // Appointment.hasMany(models.Doctor)
  };
  return Appointment;
};