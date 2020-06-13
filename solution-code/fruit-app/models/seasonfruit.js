'use strict';
module.exports = (sequelize, DataTypes) => {
  const SeasonFruit = sequelize.define('SeasonFruit', {
    fruitId: DataTypes.INTEGER,
    seasonId: DataTypes.INTEGER
  }, {});
  SeasonFruit.associate = function(models) {
    // associations can be defined here
  };
  return SeasonFruit;
};