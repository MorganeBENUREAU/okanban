const models = require('./../models');

const getModelNameFromParams = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1, -1);
}

const mainController = {
  async getAll(req, res, next) {
    const modelName = getModelNameFromParams(req.params.modelName);
    const currentModel = models[modelName];

    if (!currentModel) {
      next();
      return;
    }

    try {
      const data = await currentModel.findAll();
      res.json(data);
    } catch (e) {
      console.trace(e);
      res.status(500).send(e.errors || e.toString());
    }
  },
  async create(req, res) {
    const modelName = getModelNameFromParams(req.params.modelName);
    const currentModel = models[modelName];

    if (!currentModel) {
      next();
      return;
    }

    try {
      const data = await currentModel.create(req.body);
      res.json(data);
    } catch (e) {
      console.trace(e);
      res.status(500).send(e.errors || e.toString());
    }
  },

  async getOne(req, res, next) {
    const modelName = getModelNameFromParams(req.params.modelName);
    const currentModel = models[modelName];

    if (!currentModel) {
      next();
      return;
    }

    try {
      const data = await currentModel.findByPk(req.params.id);
      if(!data) {
        next();
        return;
      }
      res.json(data);
    } catch (e) {
      console.trace(e);
      res.status(500).send(e.errors || e.toString());
    }
  },

  async update(req, res, next) {
    const modelName = getModelNameFromParams(req.params.modelName);
    const currentModel = models[modelName];

    if (!currentModel) {
      next();
      return;
    }

    try {
      const data = await currentModel.findByPk(req.params.id);
      if(!data) {
        next();
        return;
      }

      // Je boucle sur chaque propriété de mon objet req.body, je modifie les propriétés de mon objet instancier avec chaqu'une des données du body
      for(const key in req.body) {
        data[key] = req.body[key];
      }

      await data.save();

      res.json(data);
    } catch (e) {
      console.trace(e);
      res.status(500).send(e.errors || e.toString());
    }
  },

  async delete(req, res, next) {
    const modelName = getModelNameFromParams(req.params.modelName);
    const currentModel = models[modelName];

    if (!currentModel) {
      next();
      return;
    }

    try {
      const nbRemoved = await currentModel.destroy({
        where: { 
          id: req.params.id
        }
      });

      if(!nbRemoved) {
        next();
        return;
      }
      res.json({
        success: true
      });
    } catch (e) {
      console.trace(e);
      res.status(500).send(e.errors || e.toString());
    }
  },
};

module.exports = mainController;
