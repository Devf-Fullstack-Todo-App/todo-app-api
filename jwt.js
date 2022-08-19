const hmacSHA256 = require('crypto-js/hmac-sha256');
const Base64 = require('crypto-js/enc-base64');
const { stringify } = require('crypto-js/enc-base64');

console.log('Entiendo JWT');

// 1. Codificacion en Base64
  // a. Codigo binario
  // b. Sistema ASCII

// 2. Stringificacion de JSON

// 3. Parseo de JSON


const encodginhReplacements = {
  '+': '-',
  '/': '_',
  '=': ''
}

const makeUrlSafe = (encodedBase64) => {
  return encodedBase64.replace(
    /[+/=]/g,
    (match) => encodginhReplacements[match]
  )
}

const encode = obj => {
  const encoded = btoa(JSON.stringify(obj));
  return makeUrlSafe(encoded);
}

const makeSignature = (header, payload, secret) => {
  const hashed = hmacSHA256(`${header}.${payload}`, secret);
  const stringify = Base64.stringify((hashed))
  return makeUrlSafe(stringify);
}

const getJWT = (encodedHeade, encodedPayload, signature) => {
  return `${encodedHeade}.${encodedPayload}.${signature}`
}

const SECRET = 'secreto1234';

/* Header */
const header = {
  alg: 'HS256',
  typ: 'JWT'
}

console.log('JWT Header: ', );
console.log('Header', encode(header))


/* Payload */
const payload = {
    "sub": "1234567890",
    "name": "John Doe",
    "iat": 1516239022
}

console.log('JWT Payload: ', );
console.log('Payload', encode(payload))


/* Signature */
console.log('JWT: ',);
console.log('Signature: ', makeSignature(encode(header), encode(payload), SECRET));


