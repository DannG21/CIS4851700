const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const db = require('./config/database');
const userRoutes = require('./routes/users');
const habitRoutes = require('./routes/habits');
const recordRoutes = require('./routes/records');
const streakRoutes = require('./routes/streaks');
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/streaks', streakRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Habit Tracker API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Database connection and server startup
async function startServer() {
  try {
    // Test database connection
    await db.testConnection();
    console.log('Database connected successfully');

    // HTTPS configuration
    let server;
    if (process.env.NODE_ENV === 'production') {
      const httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, 'config', 'ssl', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'config', 'ssl', 'cert.pem'))
      };
      server = https.createServer(httpsOptions, app);
      server.listen(PORT, () => {
        console.log(`HTTPS Server running in production mode on port ${PORT}`);
      });
    } else {
      app.listen(PORT, () => {
        console.log(`HTTP Server running in development mode on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
}

startServer();
