const { check, validationResult } = require('express-validator');
const db = require('../config/database');
const bcrypt = require('bcryptjs');

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

class User {
    static async findById(id) {
        try {
            const result = await db.query(
                'SELECT id, username, email, created_at FROM users WHERE id = $1',
                [id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error('Error finding user by ID: ' + error.message);
        }
    }

    static async findByEmail(email) {
        try {
            const result = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error('Error finding user by email: ' + error.message);
        }
    }

    static async create(userData) {
        const { username, email, password } = userData;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await db.query(
                `INSERT INTO users (username, email, password_hash)
                VALUES ($1, $2, $3)
                RETURNING id, username, email, created_at`,
                [username, email, hashedPassword]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    static async update(id, userData) {
        const { username, email } = userData;
        try {
            const result = await db.query(
                `UPDATE users 
                SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
                WHERE id = $3
                RETURNING id, username, email, created_at`,
                [username, email, id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            await db.query('DELETE FROM users WHERE id = $1', [id]);
            return true;
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }

    static async validatePassword(user, password) {
        return await bcrypt.compare(password, user.password_hash);
    }
}

module.exports = User;