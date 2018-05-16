const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./db');
const { parameters } = require('./parameters');
const { errorHandler } = require('./middlewares/errorHandlers');

// Routes
const { defaultRoutes } = require('./routes');
const { apiRoutes } = require('./routes');

const app = express();

db.connect();

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

if (!parameters.app.isInEnv('test')) {
  app.use(logger(parameters.app.isInEnv('production') ? 'combined' : 'dev'));
}

app.use('/', defaultRoutes);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
