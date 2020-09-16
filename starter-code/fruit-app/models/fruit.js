'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fruit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Fruit.init({
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    readyToEat: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Fruit',
  });
  return Fruit;
};