class UsersRepository {
  constructor({ UserModel }) {
    this.UserModel = UserModel;
  }

  async findOne(conditions = {}) {
    return this.UserModel.findOne(conditions).exec();
  }

  async add(documents) {
    return this.UserModel.create(...documents);
  }

  // eslint-disable-next-line class-methods-use-this
  async save(user) {
    await user.save();
    return user;
  }

  async findOrCreate(userSub) {
    let user = await this.findOne({ sub: userSub });
    if (!user) {
      user = await this.add([{ sub: userSub }]);
    }
    return user;
  }
}

module.exports = UsersRepository;
