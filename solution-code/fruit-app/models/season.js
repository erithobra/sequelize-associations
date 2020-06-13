'use strict';
module.exports = (sequelize, DataTypes) => {
  const Season = sequelize.define('Season', {
    name: DataTypes.STRING
  }, {});
  Season.associate = function(models) {
    Season.belongsToMany(models.Fruit, {
      through: 'SeasonFruit',
      foreignKey: 'seasonId',
      otherKey: 'fruitId'
    })
  };
  return Season;
};