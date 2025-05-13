const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const users = [];

const JWT_SECRET = 'yourServerSecret';

function authMiddleware(req, res, next) {
  if (req.path.startsWith('/account/')) return next();

  const token = req.cookies.token;
  if (!token) {
    const returnUrl = encodeURIComponent(req.originalUrl);
    return res.redirect(`/account/login-page?returnUrl=${returnUrl}`);
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      const returnUrl = encodeURIComponent(req.originalUrl);
      return res.redirect(`/account/login-page?returnUrl=${returnUrl}`);
    }
    req.user = decoded;
    next();
  });
}
app.use(authMiddleware);

app.get('/home', (req, res) => {
  res.send('<h1>Home</h1><p>Welcome to our site!</p>');
});

app.get('/about', (req, res) => {
  res.send('<h1>About</h1><p>About us page.</p>');
});

app.get('/contact', (req, res) => {
  res.send('<h1>Contact</h1><p>Contact us at contact@example.com.</p>');
});

app.get('/account/login-page', (req, res) => {
  const returnUrl = req.query.returnUrl || '/home';
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/account/sign-up-page', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post('/account/sign-up', async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).send('Username already exists');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ username, passwordHash });
  res.status(201).send('User created.');
});

app.post('/account/login', async (req, res) => {
  const { username, password, returnUrl } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).send('Invalid username/password');
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(400).send('Invalid username/password');
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: false });
  res.redirect(returnUrl || '/home');
});

app.post('/account/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/account/login-page');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));