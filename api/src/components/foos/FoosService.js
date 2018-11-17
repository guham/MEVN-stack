class FoosService {
  constructor({ foosRepository }) {
    this.foosRepository = foosRepository;
  }

  async getAll(conditions = {}) {
    return this.foosRepository.find(conditions);
  }

  async add(documents) {
    return this.foosRepository.add(documents);
  }

  async getById(id) {
    return this.foosRepository.getById(id);
  }
}

module.exports = FoosService;
