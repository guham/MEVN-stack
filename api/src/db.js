const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

class Db {
  constructor({ parameters, debug }) {
    this.instance = null;
    this.parameters = parameters;
    this.debug = debug('db');
    this.connection = mongoose.connection;
    this.connection.on('connected', () => this.debug('MongoDB connection: connected'));
    this.connection.on('disconnected', () => this.debug('MongoDB connection: disconnected'));
    this.connection.on('reconnect', () => this.debug('MongoDB connection: reconnected'));
  }

  async connect() {
    const { uri } = this.parameters.db;
    try {
      this.instance = await mongoose.connect(uri, {
        autoReconnect: true,
        reconnectTries: 60,
        reconnectInterval: 1000,
        autoIndex: !this.parameters.app.isInEnv('production'),
      });
      this.debug(`MongoDB running on ${uri}`);
    } catch (error) {
      this.debug(error);
      throw error;
    }
  }

  async disconnect(fn) {
    await mongoose.disconnect(fn);
    this.debug('MongoDB: all connections are closed');
  }
}

module.exports = Db;
