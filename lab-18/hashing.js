const crypto = require('crypto');

function hashData(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Command-line support
const input = process.argv[2] || 'Hello, World!';
console.log('SHA-256 Hash:', hashData(input));