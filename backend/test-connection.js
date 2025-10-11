// Test PostgreSQL connection
const { Pool } = require('pg');
const config = require('./config');

console.log('Testing PostgreSQL connection...');
console.log('Config:', config.database);

const pool = new Pool(config.database);

pool.on('connect', () => {
  console.log('✅ Successfully connected to PostgreSQL database');
  pool.end();
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err.message);
  console.log('\nTroubleshooting steps:');
  console.log('1. Make sure PostgreSQL is running');
  console.log('2. Check if the database "door_management" exists');
  console.log('3. Verify username and password in config.js');
  console.log('4. Check if PostgreSQL is listening on port 5432');
  pool.end();
});

// Test query
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Query error:', err.message);
  } else {
    console.log('✅ Query successful:', res.rows[0]);
  }
  pool.end();
});
