/*
Lab-15
Student Name= Daniel Aparicio

What is the difference between cookies and sessions?
A: Cookies are small pieces of data stored on the client and sent with every request to the server. Sessions, 
store data on the server side and are referenced via a session ID that is typically stored in a cookie. 
This means sessions are generally more secure for storing sensitive information because the actual data resides on the server.

How can you make cookies and sessions more secure in production environments?
A: - Set the cookie's secure flag to true so that cookies are only sent over HTTPS.
   - Use a robust session store like MongoDB instead of storing sessions in memory.
   - Use strong, secret keys for signing cookies and session IDs.

When would you use a session instead of a cookie, and vice versa?
A: - I use sessions when I need to store sensitive data or large amounts of information that should not be exposed to the client. 
Sessions keep the data on the server and only pass a reference to the client.
   - I use cookies for lightweight data that does not require high security, such as user preferences or non-sensitive tokens, 
   especially when I want the data to persist across browser sessions without requiring server storage.
*/

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.use(cookieParser());

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        httpOnly: true 
    }
}));

app.get('/', (req, res) => {
    res.send('Welcome to the home page');
});

app.get('/set-cookie', (req, res) => {
    res.cookie('username', 'student', { maxAge: 900000, httpOnly: true });
    res.send('Cookie has been set!');
});

app.get('/get-cookie', (req, res) => {
    const username = req.cookies.username;
    res.send(`Username stored in cookie: ${username}`);
});

app.get('/delete-cookie', (req, res) => {
    res.clearCookie('username');
    res.send('Cookie deleted');
});

app.get('/login', (req, res) => {
    req.session.user = { username: 'student' };
    res.send('You are logged in');
});

app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome, ${req.session.user.username}`);
    } else {
        res.send('Please log in first');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out');
        }
        res.clearCookie('connect.sid');
        res.send('You have logged out');
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});