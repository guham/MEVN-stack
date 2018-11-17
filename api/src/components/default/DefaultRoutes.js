const { Router } = require('express');
const { makeInvoker } = require('awilix-express');
const { asyncMiddleware } = require('../../middlewares/errorHandlers');
const defaultController = require('./DefaultController');

const router = Router();
const api = makeInvoker(defaultController);

router.get('/', asyncMiddleware(api('index')));
router.get('/favicon.ico', asyncMiddleware(api('favicon')));

module.exports = router;
