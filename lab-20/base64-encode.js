const input = process.argv[2];
const encoded = Buffer.from(input).toString('base64');
console.log(encoded);