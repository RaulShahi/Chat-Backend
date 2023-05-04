const bcrypt = require("bcryptjs");

exports.encryptPassword = async (password, seed) => {
  const salt = await bcrypt.genSalt(seed);
  return bcrypt.hashSync(password, salt);
};
