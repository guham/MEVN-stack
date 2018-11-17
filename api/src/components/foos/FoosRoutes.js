const { Router } = require('express');
const { makeInvoker } = require('awilix-express');
const { asyncMiddleware } = require('../../middlewares/errorHandlers');
const foosController = require('./FoosController');

const router = Router();
const api = makeInvoker(foosController);

router.get('/', asyncMiddleware(api('index')));
router.post('/add', asyncMiddleware(api('add')));
router.get('/test', asyncMiddleware(api('test')));
router.get('/:id', asyncMiddleware(api('get')));

module.exports = router;
