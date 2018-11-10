const { User } = require('../models');

exports.findOrCreate = async (userSub) => {
  let user = await User.findOne({ sub: userSub }).exec();
  if (!user) {
    user = new User({ sub: userSub });
    await user.save();
  }
  return user;
};

exports.storeUserRefreshToken = async (userSub, refreshToken) => {
  const user = await exports.findOrCreate(userSub);
  const timestamp = new Date().getTime();
  user.refreshTokens.set(timestamp.toString(), refreshToken);
  await user.save();
  return user;
};

/**
 * @param {object} user
 * @param {string} refreshToken
 * @returns {boolean} true if the refresh token existed and has been removed, otherwise false
 */
exports.removeUserRefreshToken = async (user, refreshToken) => {
  const tokens = user.refreshTokens;
  const entry = Array.from(tokens).filter(element => element[1] === refreshToken).shift();
  if (!entry) {
    return false;
  }

  tokens.delete(entry[0]);
  await user.save();
  return true;
};
