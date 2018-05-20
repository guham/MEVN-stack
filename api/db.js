const mongoose = require('mongoose');
const debug = require('./components').debug('db');
const { parameters } = require('./parameters');
mongoose.Promise = require('bluebird');

const { uri } = parameters.db;
const { connection } = mongoose;

connection.on('connected', () => debug('MongoDB connection: connected'));
connection.on('disconnected', () => debug('MongoDB connection: disconnected'));
connection.on('reconnect', () => debug('MongoDB connection: reconnected'));

module.exports = {
  mongoose,
  connect() {
    return mongoose.connect(uri, {
      autoReconnect: true,
      reconnectTries: 60,
      reconnectInterval: 1000,
      autoIndex: parameters.app.isInEnv('development'),
    }).then((db) => {
      debug(`MongoDB running on ${uri}`);
      return db;
    }).catch((err) => {
      debug(err);
      return err;
    });
  },
  disconnect(fn) {
    return mongoose.disconnect(fn);
  },
};
