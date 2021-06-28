const sequelize = require('./../database');
const {DataTypes, Model} = require('sequelize');

class Card extends Model {}

Card.init({
  title: {
    type: DataTypes.TEXT,
    defaultValue: '',
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  color: {
    type: DataTypes.TEXT,
    defaultValue: '#FFF',
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'card'
});

module.exports = Card;
