const { Router } = require('express');
const { makeInvoker } = require('awilix-express');
const { asyncHandler } = require('../../middlewares');
const defaultController = require('./DefaultController');

const router = Router();
const api = makeInvoker(defaultController);

router.get('/', asyncHandler(api('index')));
router.get('/favicon.ico', asyncHandler(api('favicon')));

module.exports = router;
