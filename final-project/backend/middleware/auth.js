const jwt = require('jsonwebtoken');
const passport = require('passport');
const logger = require('../utils/logger');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

exports.authenticate = passport.authenticate('jwt', { session: false });

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Please authenticate.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

const authorize = (req, res, next) => {
    const resourceUserId = req.params.userId || req.body.userId || 
                         (req.params.id && req.resourceUserId);
    
    if (!resourceUserId) {
        return next();
    }

    if (resourceUserId && resourceUserId !== req.user.id) {
        logger.warn(`User ${req.user.id} attempted to access resource of user ${resourceUserId}`);
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access this resource'
        });
    }

    next();
};

const checkResourceOwnership = async (req, res, next) => {
    try {
        const resourceId = req.params.id;
        const resourceType = req.baseUrl.split('/')[2];
        
        if (!resourceId) {
            return next();
        }
        
        let query = '';
        let result = null;
        
        switch (resourceType) {
            case 'habits':
                query = 'SELECT user_id FROM habits WHERE id = $1';
                result = await db.query(query, [resourceId]);
                break;
            case 'records':
                query = 'SELECT habits.user_id FROM records JOIN habits ON records.habit_id = habits.id WHERE records.id = $1';
                result = await db.query(query, [resourceId]);
                break;
            case 'streaks':
                query = 'SELECT habits.user_id FROM streaks JOIN habits ON streaks.habit_id = habits.id WHERE streaks.id = $1';
                result = await db.query(query, [resourceId]);
                break;
            default:
                return next();
        }
        
        if (!result || result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }
        
        req.resourceUserId = result.rows[0].user_id;
        
        if (req.user.id !== req.resourceUserId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resource'
            });
        }
        
        next();
    } catch (err) {
        logger.error('Error checking resource ownership:', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = {
    auth,
    authorize,
    checkResourceOwnership,
    generateToken
};