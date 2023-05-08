const bcrypt = require("bcryptjs");

exports.encryptPassword = async (password, seed) => {
  const salt = bcrypt.genSaltSync(seed);
  const cryptedPW = bcrypt.hashSync(password, salt);
  return cryptedPW;
};
