const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('missing JWT_SECRET');
}

async function verifyToken(token) {
  if(!token) throw new Error('missing token')

  const decoded = await jwt.verify(token, JWT_SECRET, (err, _decoded) => {
    if (err) {
      return null
    }

    if (new Date().getTime() > (_decoded.exp * 1000)) {
      return null
    }

    return _decoded
  })

  return decoded
}

module.exports = verifyToken