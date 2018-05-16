const mongoose = require('mongoose');
const debug = require('./components').debug('db');
const { parameters } = require('./parameters');
mongoose.Promise = require('bluebird');

const { uri } = parameters.db;

const db = mongoose.connection;
db.on('connected', () => debug('MongoDB connection: connected'));
db.on('disconnected', () => debug('MongoDB connection: disconnected'));
db.on('reconnect', () => debug('MongoDB connection: reconnected'));

module.exports = {
  connect: () => {
    mongoose.connect(uri, {
      autoReconnect: true,
      reconnectTries: 60,
      reconnectInterval: 1000,
      autoIndex: parameters.app.isInEnv('development'),
    }).then(() => {
      debug(`MongoDB running on ${uri}`);
    }, (err) => {
      debug(err);
    });
  },
  disconnect: (fn) => {
    mongoose.disconnect(fn);
  },
};
