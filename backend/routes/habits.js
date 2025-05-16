const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const habitController = require('../controllers/habitController');
const { auth } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/habits
// @desc    Get all habits for user
// @access  Private
router.get('/', habitController.getHabits);

// @route   GET /api/habits/:id
// @desc    Get single habit
// @access  Private
router.get('/:id', habitController.getHabit);

// @route   POST /api/habits
// @desc    Create a habit
// @access  Private
router.post(
    '/',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('frequency', 'Frequency is required').not().isEmpty(),
        check('target_count', 'Target count must be a positive number').isInt({ min: 1 })
    ],
    habitController.createHabit
);

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put(
    '/:id',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('frequency', 'Frequency is required').not().isEmpty(),
        check('target_count', 'Target count must be a positive number').isInt({ min: 1 })
    ],
    habitController.updateHabit
);

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', habitController.deleteHabit);

// @route   POST /api/habits/:id/complete
// @desc    Log habit completion
// @access  Private
router.post('/:id/complete', habitController.logHabitCompletion);

// @route   GET /api/habits/:id/stats
// @desc    Get habit statistics
// @access  Private
router.get('/:id/stats', habitController.getHabitStats);

module.exports = router;