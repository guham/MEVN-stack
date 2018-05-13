const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const debug = require('debug')('app');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const { errorHandler } = require('./middlewares/errorHandlers');

// MongoDB
const { MONGODB_URI } = process.env;

const { defaultRoutes } = require('./routes');
const { apiRoutes } = require('./routes');

const app = express();

mongoose.connect(MONGODB_URI, {
  autoReconnect: true,
  reconnectTries: 60,
  reconnectInterval: 1000,
  autoIndex: process.env.NODE_ENV === 'development',
}).then(
  () => { debug(`MongoDB running on ${MONGODB_URI}`); },
  (err) => { debug(err); },
);

const db = mongoose.connection;
db.on('connected', () => debug('MongoDB connection: connected'));
db.on('disconnected', () => debug('MongoDB connection: disconnected'));
db.on('reconnect', () => debug('MongoDB connection: reconnected'));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use('/', defaultRoutes);
app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
