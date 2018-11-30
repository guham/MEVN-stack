const fs = require('fs');
const path = require('path');
const models = require('../models');

const modelsPath = path.join(__dirname, 'models');

module.exports = (factory) => {
  fs.readdirSync(modelsPath).forEach((file) => {
    const modelPath = path.join(modelsPath, file);
    // eslint-disable-next-line import/no-dynamic-require
    const modelFactory = require(modelPath);
    modelFactory(factory, models);
  });

  return factory;
};
