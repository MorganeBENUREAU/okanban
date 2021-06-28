const { Tag, Card } = require('../models');

const tagController = {
  associateTagToCard: async (req, res) => {
    try {
      const cardId = req.params.id;
      const tagId = req.body.tagId || req.body.tag_id;

      let card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      if (!card) {
        res.status(404).json('Can not find card with id ' + cardId);
        return;
      }

      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        res.status(404).json('Can not find tag with id ' + tagId);
        return;
      }

      // on laisse faire la magie de Sequelize ! 
      // pour savoir comment Sequelize à décider de nommer cette méthode https://sequelize.org/master/manual/assocs.html => Note: Method names
      await card.addTag(tag);
      // malheureusement, les associations de l'instance ne sont pas mises à jour
      // on doit donc refaire un select
      card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      res.json(card);

    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  removeTagFromCard: async (req, res) => {
    try {
      const { cardId, tagId } = req.params;

      let card = await Card.findByPk(cardId);
      if (!card) {
        res.status(404).json('Can not find card with id ' + cardId);
        return;
      }

      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        res.status(404).json('Can not find tag with id ' + tagId);
        return;
      }

      await card.removeTag(tag);
      card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      res.json(card);

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  }
};

module.exports = tagController;
