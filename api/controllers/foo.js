const { Foo } = require('../models');

exports.index = async (req, res, next) => {
  const foos = await Foo.find().exec();
  res.json({ data: foos.length });
};

exports.add = async (req, res, next) => {
  const foo = new Foo({ name: 'default name' });
  await foo.save();
  res.status(201).json({ data: foo });
};

exports.get = async (req, res, next) => {
  const { id } = req.params;
  const foo = await Foo.findById(id).exec();
  res.json({ data: foo });
};

exports.test = (req, res, next) => {
  res.json({
    value: 'This is a value fetched from server',
  });
};
