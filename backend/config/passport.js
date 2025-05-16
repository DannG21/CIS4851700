const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('./db');
const logger = require('../utils/logger');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
      try {
        const result = await db.query(
          'SELECT id, username, email FROM users WHERE id = $1',
          [jwtPayload.id]
        );

        const user = result.rows[0];
        
        if (user) {
          return done(null, user);
        }
        
        return done(null, false);
      } catch (err) {
        logger.error('Error in passport strategy:', err);
        return done(err, false);
      }
    })
  );
};