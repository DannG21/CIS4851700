const crypto = require('crypto');
const CryptoJS = require('crypto-js');

function hashData(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function encodeBase64(data) {
  return Buffer.from(data, 'utf-8').toString('base64');
}

function decodeBase64(encodedData) {
  return Buffer.from(encodedData, 'base64').toString('utf-8');
}

function encryptData(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

function decryptData(encryptedData, key) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function secureProcess(password, key) {
  const hashed = hashData(password);
  const encoded = encodeBase64(hashed);
  const encrypted = encryptData(encoded, key);
  const decrypted = decryptData(encrypted, key);
  const decoded = decodeBase64(decrypted);

  console.log('Hashed:', hashed);
  console.log('Base64 Encoded:', encoded);
  console.log('Encrypted:', encrypted);
  console.log('Decrypted & Decoded:', decoded);
}

const password = process.argv[2] || 'myPassword123';
const encryptionKey = process.argv[3] || 'mySecretKey123';

secureProcess(password, encryptionKey);