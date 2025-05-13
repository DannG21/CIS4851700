const express = require('express');
const https   = require('https');
const fs      = require('fs');
const crypto = require('crypto');
const { exec } = require('child_process');
const SECRET = 'AppleBananaCherry42';

function verifySignature(req) {
  const sig = req.headers['x-hub-signature-256'] || '';
  const hmac = crypto.createHmac('sha256', SECRET)
                     .update(JSON.stringify(req.body))
                     .digest('hex');
  return sig === `sha256=${hmac}`;
}

app.use(express.json());

app.post('/webhook', (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send('Invalid signature');
  }
  exec('git pull && pm2 restart ci-cd-lab', (err, stdout, stderr) => {
    if (err) {
      console.error('Deploy error:', stderr);
      return res.status(500).send('Deploy failed');
    }
    console.log('Deploy success:', stdout);
    res.send('Deployed');
  });
});

const app = express();
app.get('/', (req, res) => {
  res.send('Hello, HTTPS CI/CD world!!');
});

const options = {
  key:  fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};
https.createServer(options, app)
  .listen(5443, () => {
    console.log('Listening on https://localhost:5443');
  });