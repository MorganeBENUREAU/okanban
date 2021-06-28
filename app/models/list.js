const sequelize = require('./../database');
const {DataTypes, Model} = require('sequelize');

class List extends Model {}

List.init({
  name: {
    type: DataTypes.TEXT,
    defaultValue: '',
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  position: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
}, {
  // Sequelize nous permet de faire des choses trop cool
  // On peut par défault lui définir ce qu'on appel un scope qui nous permettra d'ajouter des options par défault à nos requêtes. Dans notre cas, on lui dit par défault d'inclure nos associations cards et les tags de ses dernières ainsi qu'un order par défault sur la position
  defaultScope: {
    include: [{
      association: 'cards',
      include: 'tags'
    }],
    order: [
      ['position', 'ASC']
    ]
  },
  sequelize,
  tableName: 'list'
});

module.exports = List;
