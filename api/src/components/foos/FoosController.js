const foosController = ({ foosService }) => ({
  index: async (req, res, next) => {
    const foos = await foosService.getAll();
    res.json(foos);
  },

  add: async (req, res, next) => {
    const { name } = req.body;
    const foo = await foosService.add([
      { name },
    ]);
    res.status(201).json(foo);
  },

  get: async (req, res, next) => {
    const { id } = req.params;
    const foo = await foosService.getById(id);
    res.json(foo);
  },

  test: async (req, res, next) => {
    res.json({ data: 'This is a message fetched from the API' });
  },
});

module.exports = foosController;
