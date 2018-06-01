const express = require('express');

const router = express.Router();

const { fooController } = require('../controllers');
const { errorHandlers } = require('../middlewares');

router.get('/', errorHandlers.asyncMiddleware(fooController.index));

router.post('/add', errorHandlers.asyncMiddleware(fooController.add));

router.get('/test', errorHandlers.asyncMiddleware(fooController.test));

router.get('/:id', errorHandlers.asyncMiddleware(fooController.get));

module.exports = router;
