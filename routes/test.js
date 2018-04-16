'use strict';

const express = require('express')
const router = express.Router()

/* GET test page. */
router.get('/test', (req, res) => {
  res.send(
    [{
      title: "Test page",
    }]
  )
})

module.exports = router
