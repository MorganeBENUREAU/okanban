require('dotenv').config();
const {List, Card, Tag} = require('./app/models');
const sequelize = require('./app/database');

const run = async () => {
  await sequelize.sync({ force: true });

  const list = await new List({
    name: 'La plus belle des listes'
  }).save();

  const tag = await new Tag({
    name: 'Premier tag',
    color: '#F0F'
  }).save();

  const card = await new Card({
    title: 'Ma carte',
    color: '#F0F',
    list_id: list.id,
  }).save();

  await card.addTag(tag);
}

run();
