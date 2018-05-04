const express = require('express')
const router = express.Router()

const fooRoutes = require('./foo')

router.use('/foo', fooRoutes)

module.exports = router
