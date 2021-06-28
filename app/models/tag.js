const sequelize = require('./../database');
const {DataTypes, Model} = require('sequelize');

class Tag extends Model {}

Tag.init({
  name: {
    type: DataTypes.TEXT,
    defaultValue: '',
    allowNull: false
  },
  color: {
    type: DataTypes.TEXT,
    defaultValue: '#F0F',
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'tag'
});

module.exports = Tag;
