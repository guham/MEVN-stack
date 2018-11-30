const factoryGirl = require('factory-girl');
const loader = require('./factories/loader');

const { factory } = factoryGirl;
const adapter = new factoryGirl.MongooseAdapter();
factory.setAdapter(adapter);

module.exports = loader(factory);
