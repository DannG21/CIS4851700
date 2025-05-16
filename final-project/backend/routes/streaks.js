const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const streakController = require('../controllers/streakController');

// Get streak for a specific habit
router.get('/habit/:habitId', auth, (req, res) => {
    streakController.getStreak(req, res);
});

// Get all streaks for user
router.get('/', auth, (req, res) => {
    streakController.getAllStreaks(req, res);
});

// Recalculate streak for a habit
router.post('/recalculate/:habitId', auth, (req, res) => {
    streakController.recalculateStreak(req, res);
});

// Get leaderboard
router.get('/leaderboard', auth, (req, res) => {
    streakController.getLeaderboard(req, res);
});

// Get streak statistics
router.get('/stats', auth, (req, res) => {
    streakController.getStreakStats(req, res);
});

module.exports = router;