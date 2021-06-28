const express = require('express');
const listController = require('./controllers/listController');
const tagController = require('./controllers/tagController');
const mainController = require('./controllers/mainController');
const router = express.Router();

// On défini la route /lists et on lui spécifie les actions avec faire sur le get et post
// router.route('/lists')
//   .get(listController.getAllLists)
//   .post(listController.createList);

// On défini la route /lists/:id et on lui spécifie les actions avec faire sur le get, patch et delete
// router.route('/lists/:id(\\d+)')
//   .get(listController.getOneList)
//   .patch(listController.updateList)
//   .delete(listController.deleteList);

// équivalent à
/*
  router.get('/lists', listController.getAllLists)
  router.post('/lists', listController.createList)

  router.get('/lists/:id(\\d+)', listController.getOneList)
  router.patch('/lists/:id(\\d+)', listController.updateList)
  router.delete('/lists/:id(\\d+)', listController.deleteList)
*/

router.route('/:modelName')
  .get(mainController.getAll)
  .post(mainController.create)

router.delete('/lists', listController.deleteAllLists);

router.route('/:modelName/:id(\\d+)')
  .get(mainController.getOne)
  .patch(mainController.update)
  .delete(mainController.delete);

router.post('/cards/:id/tags', tagController.associateTagToCard);
router.delete('/cards/:cardId/tags/:tagId', tagController.removeTagFromCard);

module.exports = router;
