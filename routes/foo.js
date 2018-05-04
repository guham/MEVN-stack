const express = require('express')
const router = express.Router()

const { fooController } = require('../controllers')
const { asyncMiddleware } = require('../middlewares/errorHandlers')

router.get('/', asyncMiddleware(fooController.index))

router.get('/add', asyncMiddleware(fooController.add))

router.get('/throw-exception', asyncMiddleware(fooController.throwException))

router.get('/test', asyncMiddleware(fooController.test))

module.exports = router
