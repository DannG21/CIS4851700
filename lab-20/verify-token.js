const jwt = require('jsonwebtoken');

function verifyJWT(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
    console.log('Token is valid. Payload:', decoded);
  } catch (error) {
    console.error('Invalid token:', error.message);
  }
}

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: node verify-token.js <JWT> <secret key>');
  process.exit(1);
}

const token = args[0];
const secretKey = args[1];

verifyJWT(token, secretKey);