const jwt = require('jsonwebtoken');
const User = require('../models/User');
router.post('/login', async (req, res) => {
  const user = await User.authenticate(req.body);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.userId = user.id;
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token });
});