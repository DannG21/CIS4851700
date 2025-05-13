const express = require('express');
const jwt = require('jsonwebtoken');
const authorize = require('./authorize');
const app = express();

app.use(express.json());
const SECRET = 'yourSecretKey';

function verifyJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).send('Token missing');
  jwt.verify(auth.split(' ')[1], SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = decoded;
    next();
  });
}

app.get(
  '/jwt-superuser',
  verifyJWT,
  authorize(['admin','superuser'], req => req.user.role),
  (req, res) => res.send('Welcome to superuser area')
);

app.listen(3003, () => {
  console.log('JWT+GenericAuth server on port 3003');
});
