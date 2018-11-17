const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    sub: {
      type: String,
      required: true,
      unique: true,
    },
    refreshTokens: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', schema);
