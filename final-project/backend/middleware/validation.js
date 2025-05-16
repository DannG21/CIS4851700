const { check, validationResult } = require('express-validator');

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

exports.validateUserRegistration = [
  check('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  
  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  check('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  exports.handleValidationErrors
];

exports.validateLogin = [
  check('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  
  check('password')
    .trim()
    .notEmpty().withMessage('Password is required'),
  
  exports.handleValidationErrors
];

exports.validateHabit = [
  check('name')
    .trim()
    .notEmpty().withMessage('Habit name is required')
    .isLength({ max: 100 }).withMessage('Habit name must be less than 100 characters'),
  
  check('frequency')
    .trim()
    .notEmpty().withMessage('Frequency is required')
    .isIn(['daily', 'weekly', 'monthly', 'custom']).withMessage('Invalid frequency value'),
  
  check('target_days')
    .optional()
    .isArray().withMessage('Target days must be an array'),
  
  check('start_date')
    .notEmpty().withMessage('Start date is required')
    .isDate().withMessage('Start date must be a valid date'),
  
  check('end_date')
    .optional()
    .isDate().withMessage('End date must be a valid date'),
  
  exports.handleValidationErrors
];

exports.validateRecord = [
  check('habit_id')
    .notEmpty().withMessage('Habit ID is required')
    .isUUID().withMessage('Habit ID must be a valid UUID'),
  
  check('date')
    .notEmpty().withMessage('Date is required')
    .isDate().withMessage('Date must be a valid date'),
  
  check('completed')
    .isBoolean().withMessage('Completed status must be a boolean'),
  
  exports.handleValidationErrors
];

exports.validateStreak = [
  check('habit_id')
    .notEmpty().withMessage('Habit ID is required')
    .isUUID().withMessage('Habit ID must be a valid UUID'),
  
  check('start_date')
    .notEmpty().withMessage('Start date is required')
    .isDate().withMessage('Start date must be a valid date'),
  
  check('end_date')
    .optional()
    .isDate().withMessage('End date must be a valid date'),
  
  check('length')
    .notEmpty().withMessage('Streak length is required')
    .isInt({ min: 1 }).withMessage('Streak length must be a positive integer'),
  
  exports.handleValidationErrors
];