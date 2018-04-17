'use strict';

const express = require('express')
const router = express.Router()

/* GET test page. */
router.get('/test', (req, res) => {
  res.send(
    {
      value: 'This is a value fetched from server',
    }
  )
})

module.exports = router
