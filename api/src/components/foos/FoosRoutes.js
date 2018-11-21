const { Router } = require('express');
const { makeInvoker } = require('awilix-express');
const { asyncHandler } = require('../../middlewares');
const foosController = require('./FoosController');

const router = Router();
const api = makeInvoker(foosController);

router.get('/', asyncHandler(api('index')));
router.post('/add', asyncHandler(api('add')));
router.get('/test', asyncHandler(api('test')));
router.get('/:id', asyncHandler(api('get')));

module.exports = router;
