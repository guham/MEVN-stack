const express = require('express');

const router = express.Router();

const { fooController } = require('../controllers');
const { errorHandlers } = require('../middlewares');

router.get('/', errorHandlers.asyncMiddleware(fooController.index));

router.get('/add', errorHandlers.asyncMiddleware(fooController.add));

router.get('/throw-exception', errorHandlers.asyncMiddleware(fooController.throwException));

router.get('/test', errorHandlers.asyncMiddleware(fooController.test));

module.exports = router;
