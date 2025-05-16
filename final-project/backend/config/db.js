const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     parseInt(process.env.DB_PORT, 10),
  ssl:      process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false
});

pool.connect((err, client, release) => {
  if (err) {
    return logger.error('Error acquiring client', err.stack);
  }
  logger.info('Database connection successful');
  release();
});

module.exports = {
  query: (text, params) => {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then(res => {
          logger.debug(`Executed query: ${text}`);
          resolve(res);
        })
        .catch(err => {
          logger.error(`Query error: ${err.message}`);
          reject(err);
        });
    });
  },
  pool
};
