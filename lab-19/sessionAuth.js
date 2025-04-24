const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
const USERS = {
  user1: { password: "password123", role: "admin" },
  user2: { password: "password456", role: "user" }
};

app.post('/session-login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS[username];
  if (user && user.password === password) {
    req.session.user = { name: username, role: user.role };
    res.send(`Logged in as ${username}`);
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.post('/session-logout', (req, res) => {
  req.session.destroy();
  res.send('Logged out');
});

function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send('Please login first');
  }
}

function requireSessionRole(...allowedRoles) {
  return (req, res, next) => {
    const sess = req.session.user;
    if (!sess) return res.status(401).send('Please login first');
    if (!allowedRoles.includes(sess.role)) {
      return res.status(403).send('Forbidden: insufficient permissions');
    }
    next();
  };
}

app.get('/session-protected', requireLogin, (req, res) => {
  res.send(`Hello, ${req.session.user.name}. You have accessed a protected route.`);
});

app.get('/session-admin', requireLogin, requireSessionRole('admin'), (req, res) => {
  res.send(`Hello ${req.session.user.name}, welcome to the admin area.`);
});

app.listen(3002, () => {
  console.log('Session Auth server running on port 3002');
});