const express = require('express');
const basicAuth = require('basic-auth');
const app = express();

const USERS = {
  admin:    "password123",
  user:     "password456",
  manager:  "secret789"
};

function basicAuthMiddleware(req, res, next) {
  const user = basicAuth(req);
  if (user && USERS[user.name] === user.pass) {
    req.user = user.name;
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    res.status(401).send('Unauthorized');
  }
}

app.get('/basic-protected', basicAuthMiddleware, (req, res) => {
  res.send(`Hello, ${req.user}. You have accessed a protected route.`);
});

app.listen(3000, () => {
  console.log('Basic Auth server running on port 3000');
});