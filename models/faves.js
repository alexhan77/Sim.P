'use strict';
module.exports = (sequelize, DataTypes) => {
  const faves = sequelize.define('faves', {
    userId: DataTypes.INTEGER,
    feedId: DataTypes.INTEGER
  }, {});
  faves.associate = function(models) {
    // associations can be defined here
    models.faves.belongsTo(models.user)
    models.faves.belongsTo(models.feed)
  };
  return faves;
};