'use strict';
module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define('Doctor', {
    name: DataTypes.STRING,
    specialty: DataTypes.STRING
  }, {});
  Doctor.associate = function (models) {
    Doctor.belongsToMany(models.Patient, { through: 'Appointments', foreignKey: 'doctorId' })
    // Doctor.hasMany(models.Appointment, { foreignKey: 'doctorId' })
  };
  return Doctor;
};