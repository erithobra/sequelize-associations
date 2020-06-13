'use strict';
module.exports = (sequelize, DataTypes) => {
  const Fruit = sequelize.define('Fruit', {
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    readyToEat: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {});
  Fruit.associate = function(models) {
    Fruit.belongsTo(models.User, {foreignKey: 'userId'})
    Fruit.belongsToMany(models.Season, {
      through: 'SeasonFruit',
      foreignKey: 'fruitId',
      otherKey: 'seasonId'
    })
  };
  return Fruit;
};