const CryptoJS = require('crypto-js');

function encryptData(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

function decryptData(encryptedData, key) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Command-line support
const message = process.argv[2] || 'Sensitive Data';
const password = process.argv[3] || 'mySecretKey123';

const encrypted = encryptData(message, password);
const decrypted = decryptData(encrypted, password);

console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);