const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const { scopePerRequest } = require('awilix-express');
const { asValue } = require('awilix');

const router = require('./router');
const container = require('./container');
const { logger } = require('./components');
const { errorHandler } = require('./middlewares/errorHandlers');

const app = express();

app.use(scopePerRequest(container));
app.use((req, res, next) => {
  req.container.register({
    currentUser: asValue(req.user),
  });

  return next();
});

app.use(bodyParser.json());
app.use(cors());
app.use(logger);

app.use(router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
