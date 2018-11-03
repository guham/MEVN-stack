const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { logger } = require('./components');
const { errorHandler } = require('./middlewares/errorHandlers');
const { authenticate } = require('./middlewares/authHandlers');

// Routes
const { defaultRoutes, apiRoutes, authRoutes } = require('./routes');

const app = express();

db.connect();

app.use(bodyParser.json());
app.use(cors());
app.use(logger);

app.use('/', defaultRoutes);
app.use('/auth', authRoutes);
app.use('/api', authenticate, apiRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
