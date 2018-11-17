class FoosRepository {
  constructor({ FooModel }) {
    this.FooModel = FooModel;
  }

  async find(conditions = {}) {
    return this.FooModel.find(conditions).exec();
  }

  async add(documents) {
    return this.FooModel.create(...documents);
  }

  async getById(id) {
    return this.FooModel.findById(id).exec();
  }
}

module.exports = FoosRepository;
