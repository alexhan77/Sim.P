'use strict';
module.exports = (sequelize, DataTypes) => {
  const feed = sequelize.define('feed', {
    userId: DataTypes.INTEGER,
    pic: DataTypes.STRING,
    content: DataTypes.STRING
  }, {});
  feed.associate = function(models) {
    // associations can be defined here
    models.feed.belongsTo(models.user)
    models.feed.hasMany(models.faves)
  };
  return feed;
};