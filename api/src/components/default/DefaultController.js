const defaultController = () => ({
  index: async (req, res, next) => {
    res.json({});
  },

  favicon: async (req, res, next) => {
    res.sendStatus(204);
  },
});

module.exports = defaultController;
