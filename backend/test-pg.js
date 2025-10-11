// Test if pg library works
console.log('Testing pg library...');

try {
  const { Pool } = require('pg');
  console.log('✅ pg library imported successfully');
  
  const config = require('./config');
  console.log('✅ config loaded successfully');
  console.log('Database config:', config.database);
  
  const pool = new Pool(config.database);
  console.log('✅ Pool created successfully');
  
  console.log('\n🎉 All pg library components working!');
  console.log('The pg library is properly installed and configured.');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\nThis means:');
  console.log('1. pg library is not properly installed');
  console.log('2. Or there\'s a configuration issue');
  console.log('3. Or PostgreSQL is not running');
}
