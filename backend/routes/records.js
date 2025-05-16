const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const recordController = require('../controllers/recordController');

// Get all records for a habit
router.get('/habit/:habitId', auth, (req, res) => {
    recordController.getRecords(req, res);
});

// Get a specific record
router.get('/:id', auth, (req, res) => {
    recordController.getRecord(req, res);
});

// Create a new record
router.post(
    '/',
    [
        auth,
        [
            check('habit_id', 'Habit ID is required').not().isEmpty(),
            check('notes', 'Notes must be a string').optional().isString()
        ]
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        recordController.createRecord(req, res);
    }
);

// Update a record
router.put('/:id', auth, (req, res) => {
    recordController.updateRecord(req, res);
});

// Delete a record
router.delete('/:id', auth, (req, res) => {
    recordController.deleteRecord(req, res);
});

// Get records for a date range
router.get('/date-range', auth, (req, res) => {
    recordController.getRecordsForDateRange(req, res);
});

module.exports = router;