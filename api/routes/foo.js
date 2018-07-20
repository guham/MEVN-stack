const express = require('express');

const router = express.Router();

const { fooController } = require('../controllers');
const { asyncMiddleware } = require('../middlewares/errorHandlers');

router.get('/', asyncMiddleware(fooController.index));

router.post('/add', asyncMiddleware(fooController.add));

router.get('/test', asyncMiddleware(fooController.test));

router.get('/:id', asyncMiddleware(fooController.get));

module.exports = router;
