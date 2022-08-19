const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('missing JWT_SECRET');
}

function generateToken(userId, userType) {
  if (!userId) throw new Error('missing user id');
  if (!userType) throw new Error('missing user type');

  const payload = {
    sub: userId,
    type: userType,
    org: 'homely.mx'
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h'
  });

  return token;
}

module.exports = generateToken;