const https = require('https');
const fs    = require('fs');
const path  = require('path');

const options = {
  key:  fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

https.createServer(options, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('hello world\n');
})
.listen(3000, () => {
  console.log('Server is running on https://localhost:3000');
});
