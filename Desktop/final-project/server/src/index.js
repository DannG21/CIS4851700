const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/habits', require('./routes/habits'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/goals', require('./routes/goals'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

const session = require('express-session');

app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    maxAge: 1000 * 60 * 60 * 2
  }
}));