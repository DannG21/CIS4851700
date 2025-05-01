const express       = require('express');
const session       = require('express-session');
const bodyParser    = require('body-parser');
const { Pool }      = require('pg');
const path          = require('path');
const exphbs        = require('express-handlebars');
const xss           = require('xss');

const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'vulnerable_secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));

const pool = new Pool({
  user: 'matthewconroy',
  host: 'localhost',
  database: 'vulnerable_db',
  password: 'password',
  port: 5432,
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const queryText = `
    SELECT *
      FROM users
     WHERE username = $1
       AND password = $2
  `;
  pool.query(queryText, [username, password], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).send('Server error');
    }

    if (result.rows.length > 0) {
      req.session.loggedIn  = true;
      req.session.username  = username;
      res.redirect('/profile');
    } else {
      res.send('Login failed');
    }
  });
});

app.get('/comments', (req, res) => {
  const rawComments = req.session.comments || [];
  const safeComments = rawComments.map(c => xss(c));
  res.render('comments', { comments: safeComments });
});

app.post('/comments', (req, res) => {
  const { comment } = req.body;
  const clean = xss(comment);

  if (!req.session.comments) {
    req.session.comments = [];
  }
  req.session.comments.push(clean);

  res.redirect('/comments');
});

app.get('/profile', (req, res) => {
  if (req.session.loggedIn) {
    res.render('profile', { username: req.session.username });
  } else {
    res.status(401).send('Unauthorized access');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});