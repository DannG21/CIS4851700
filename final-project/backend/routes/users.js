const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const userController = require('../controllers/userController');

router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    userController.register(req, res);
  }
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    userController.login(req, res);
  }
);

router.get('/me', auth, userController.getCurrentUser);

router.put(
  '/profile',
  [
    auth,
    [
      check('username', 'Username is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail()
    ]
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    userController.updateProfile(req, res);
  }
);

router.put(
  '/password',
  [
    auth,
    [
      check('currentPassword', 'Current password is required').exists(),
      check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ]
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    userController.changePassword(req, res);
  }
);

router.delete('/', auth, userController.deleteAccount);

router.get('/stats', auth, userController.getUserStats);

module.exports = router;