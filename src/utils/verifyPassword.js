const bcrypt = require('bcrypt');

function verifyHashedPassword(password, hash) {
  const result = bcrypt.compareSync(password, hash);
  return result;
}

module.exports = verifyHashedPassword;
