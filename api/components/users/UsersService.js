class UsersService {
  constructor({ usersRepository }) {
    this.usersRepository = usersRepository;
  }

  async findOne(conditions = {}) {
    return this.usersRepository.findOne(conditions);
  }

  async storeUserRefreshToken(userSub, refreshToken) {
    const user = await this.usersRepository.findOrCreate(userSub);
    const timestamp = new Date().getTime();
    user.refreshTokens.set(timestamp.toString(), refreshToken);
    return this.usersRepository.save(user);
  }

  /**
   * @param {object} user
   * @param {string} refreshToken
   * @returns {boolean} true if the refresh token existed and has been removed, otherwise false
   */
  async removeUserRefreshToken(user, refreshToken) {
    const tokens = user.refreshTokens;
    const entry = Array.from(tokens).filter(element => element[1] === refreshToken).shift();
    if (!entry) {
      return false;
    }

    tokens.delete(entry[0]);
    this.usersRepository.save(user);
    return true;
  }
}

module.exports = UsersService;
