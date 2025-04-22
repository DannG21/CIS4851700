function encodeBase64(data) {
    return Buffer.from(data, 'utf-8').toString('base64');
  }
  
  function decodeBase64(encodedData) {
    return Buffer.from(encodedData, 'base64').toString('utf-8');
  }
  
  const input = process.argv[2] || 'Hello, Base64!';
  const encoded = encodeBase64(input);
  const decoded = decodeBase64(encoded);
  
  console.log('Encoded:', encoded);
  console.log('Decoded:', decoded);