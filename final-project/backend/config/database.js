const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'matthewscott',
  host: process.env.DB_HOST || '52.2.113.22',
  database: process.env.DB_NAME || 'daniel.apariciomorales73',
  password: process.env.DB_PASSWORD || 'AppleBananaCherry42',
  port: process.env.DB_PORT || 5432,
});

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', err.message);
    throw err;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection
}; 