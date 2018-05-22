const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Home');
});

router.get('/favicon.ico', (req, res) => {
  res.sendStatus(204);
});

module.exports = router;
