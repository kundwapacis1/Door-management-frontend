// backend/config.js
// Database configuration for SQLite

const path = require('path');

module.exports = {
  database: {
    filename: path.join(__dirname, 'door_management.db'),
    // SQLite doesn't need connection settings
  },
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10
  }
};
