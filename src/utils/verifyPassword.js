const bcrypt = require('bcrypt');

function verifyHashedPassword(password, hash) {
  const result = bcrypt.compare(password, hash);
  return result;
}

module.exports = verifyHashedPassword;