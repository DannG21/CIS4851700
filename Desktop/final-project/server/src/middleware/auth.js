const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  if (req.session && req.session.userId) {
    req.user = { id: req.session.userId };
    return next();
  }
  const token = (req.headers.authorization || '').split(' ')[1];
  if (token) {
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: userId };
      return next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
  res.status(401).json({ error: 'Not authenticated' });
}

module.exports = auth;