'use strict';

const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  res.send('From (Router) server.js ;)')
})

module.exports = router
