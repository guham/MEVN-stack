const { Foo } = require('../models');

exports.index = async (req, res, next) => {
  const foos = await Foo.find().exec();
  res.json(foos);
};

exports.add = async (req, res, next) => {
  const { name } = req.body;
  const foo = new Foo({ name });
  await foo.save();
  res.status(201).json(foo);
};

exports.get = async (req, res, next) => {
  const { id } = req.params;
  const foo = await Foo.findById(id).exec();
  res.json(foo);
};

exports.test = (req, res, next) => {
  res.json({ data: 'This is a message fetched from the API' });
};
