const input = process.argv[2];
const decoded = Buffer.from(input, 'base64').toString('utf8');
console.log(decoded);