const {
  List
} = require('./../models');

const listController = {
  getAllLists: async (req, res) => {
    try {
      // On récupère toutes nos listes avec les associations
      const lists = await List.findAll({
        include: [{
          association: 'cards',
          include: 'tags'
        }]
      });

      // On retourne les listes
      res.json(lists);
    } catch (e) {
      console.trace(e);
      res
        .status(500)
        .send(e.errors || e.toString());
    }
  },
  createList: async (req, res) => {
    try {
      // On créer une liste avec le contenu de req.body
      const list = await List.create(req.body);
      // On retourne la liste fraichement créer
      res.json(list);
    } catch (e) {
      console.trace(e);
      res.status(500).send(e.errors || e.toString());
    }
  },
  getOneList: async (req, res, next) => {
    try {
      // On récupère la liste grâce à son id
      const list = await List.findByPk(req.params.id, {
        include: [{
          association: 'cards',
          include: 'tags'
        }]
      });
      // Si cette dernière n'est pas trouvé on fait un next
      if (!list) {
        next();
        // Le return sert à stoper l'execution de la fonction
        return;
      }
      res.json(list);
    } catch (e) {
      res.status(500).send(e.errors || e.toString());
    }
  },
  updateList: async (req, res, next) => {
    try {
      // On récupère la liste grâce à son id
      const list = await List.findByPk(req.params.id);

      // Si cette dernière n'est pas trouvé on fait un next
      if (!list) {
        next();
        // Le return sert à stoper l'execution de la fonction
        return;
      }

      // req.body sera un objet ayant les mêmes propriétés que notre list, on peu donc boucler sur chaque propriété afin de modifier notre list
      for (const key in req.body) {
        list[key] = req.body[key];
      }

      // On sauvegarde notre objet et on le renvoie en réponse
      await list.save();

      res.json(list);
    } catch (e) {
      console.trace(e);
      res.status(500).send(e.errors || e.toString());
    }
  },
  deleteList: async (req, res, next) => {
    try {
      // Je supprime la liste grâce à son id
      const nbRemoved = await List.destroy({
        where: {
          id: req.params.id
        },
      });

      // nbRemoved contient le nombre d'élément supprimer, si aucun élément est supprimer cela signifie que notre list n'a pas été trouvé, on appel donc next
      if (!nbRemoved) {
        next();
        // Le return sert à stoper l'execution de la fonction
        return;
      }
      // L'objet est supprimer, on va juste envoyer une réponse vide à l'utilisateur, le code HTTP 200 lui suffira pour lui dire que tout est ok
      res.json({});

    } catch (e) {
      console.trace(e);
      res.status(500).send(e.errors || e.toString());
    }
  },

  deleteAllLists: async (req, res) => {
    try {
      const list = await List.destroy({
        truncate: true,
        cascade: true
      })
      res.json(list);
    } catch (error) {
      res.status(404).send('page not found');
    }
  }

};

module.exports = listController;