const Card = require('./card');
const List = require('./list');
const Tag = require('./tag');

// Nos associations
Card.belongsTo(List, {
  as: 'list',
  foreignKey: {
    name: 'list_id',
    allowNull: false
  }
});

List.hasMany(Card, {
  as: 'cards',
  foreignKey: 'list_id',
  onDelete: 'cascade'
});

Tag.belongsToMany(Card, {
  as: 'cards',
  through: 'card_has_tag',
  foreignKey: 'tag_id',
  otherKey: 'card_id',
  onDelete: 'cascade'
});

Card.belongsToMany(Tag, {
  as: 'tags',
  through: 'card_has_tag',
  foreignKey: 'card_id',
  otherKey: 'tag_id',
  onDelete: 'cascade'
});

module.exports = {
  Card,
  List,
  Tag
}
