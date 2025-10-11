// Test common PostgreSQL passwords
const { Pool } = require('pg');

const commonPasswords = [
  'postgres',
  'admin', 
  'password',
  '123456',
  '', // empty password
  'root',
  'user',
  'test'
];

const config = {
  host: 'localhost',
  port: 5432,
  database: 'postgres', // Connect to default postgres database
  user: 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
};

console.log('🔍 Testing common PostgreSQL passwords...\n');

async function testPasswords() {
  for (const password of commonPasswords) {
    try {
      console.log(`Testing password: "${password}"`);
      
      const pool = new Pool({
        ...config,
        password: password
      });
      
      const client = await pool.connect();
      console.log(`✅ SUCCESS! Password "${password}" works!`);
      
      // Test query
      const result = await client.query('SELECT version()');
      console.log(`PostgreSQL version: ${result.rows[0].version.split(' ')[0]}`);
      
      client.release();
      await pool.end();
      
      console.log(`\n🎉 Use this password in config.js:`);
      console.log(`password: '${password}',`);
      
      return password;
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }
  
  console.log('\n❌ None of the common passwords worked.');
  console.log('Please check:');
  console.log('1. PostgreSQL is running');
  console.log('2. PostgreSQL service is started');
  console.log('3. Your actual password');
  console.log('4. PostgreSQL installation');
  
  return null;
}

testPasswords();
