console.log('Entendiendo JWT');
const hmacSHA256 = require('crypto-js/hmac-sha256');
const Base64 = require('crypto-js/enc-base64');

// 1. Codificación en Base64 🫣
  // a. Código binario ✅
  // b. Sistema ASCII ✅

// 2. Stringificación de JSON ✅

// 3. Parseo de JSON ✅

const encodingReplacements = {
  '+': '-',
  '/': '_',
  '=': ''
}

const makeUrlSafe = (encodedBase64) => {
  return encodedBase64.replace(
    /[+/=]/g,
    (match) => encodingReplacements[match]
  )
}

const encode = obj => {
  const encoded = btoa(JSON.stringify(obj));
  return makeUrlSafe(encoded);
}

const makeSignature = (header, payload, secret) => {
  const hashed = hmacSHA256(`${header}.${payload}`, secret)
  const stringify = Base64.stringify(hashed);
  return makeUrlSafe(stringify);
}

const getJWT = (encodedHeader, encodedPayload, signature) => {
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const SECRET = 'secreto1234';


/* Header */
const header = {
  alg: "HS256",
  typ: "JWT"
}

console.log("JWT   : ", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
console.log("Header: ", encode(header))


/* Payload */
const payload = {
  sub: "1234567890",
  name: "John Doe",
  iat: 1516239022
}

console.log("JWT    : ", 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ');
console.log("Payload: ", encode(payload))

/* Signature */
console.log("JWT:       ", 'NVjmozRs4uJOeIVsU7xBEJLOZk6t7hm9KapQ2zssouY')
console.log("Signature: ", makeSignature(encode(header), encode(payload), SECRET))


/* JWT */
console.log("JWT: ", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.NVjmozRs4uJOeIVsU7xBEJLOZk6t7hm9KapQ2zssouY')
console.log("JWT: ", getJWT(encode(header), encode(payload),  makeSignature(encode(header), encode(payload), SECRET)))