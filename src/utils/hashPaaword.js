const bcrypt = require('bcrypt');

// TODO: Hacer las rondas de salt como variables de entorno

const SALT_ROUNDS = 12; // process.env.SALT_ROUNDS

function hashPassword(password) {
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  
  return hashedPassword;
}

module.exports = hashPassword;