// Node.js script to setup PostgreSQL database
const { Pool } = require('pg');
const fs = require('fs');
const config = require('./config');

console.log('🚀 Setting up PostgreSQL database for Door Management System...\n');

// Create a temporary pool with default postgres database
const tempPool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: 'postgres', // Connect to default postgres database
  user: config.database.user,
  password: config.database.password,
});

async function setupDatabase() {
  try {
    console.log('Step 1: Creating database "door_management"...');
    
    // Create database
    await tempPool.query('CREATE DATABASE door_management');
    console.log('✅ Database "door_management" created successfully!');
    
  } catch (error) {
    if (error.code === '42P04') {
      console.log('⚠️ Database "door_management" already exists');
    } else {
      console.error('❌ Error creating database:', error.message);
      console.log('\nTroubleshooting:');
      console.log('1. Make sure PostgreSQL is running');
      console.log('2. Check your credentials in config.js');
      console.log('3. Verify PostgreSQL user has CREATE DATABASE privileges');
      return;
    }
  }

  // Close temp pool and create new one for door_management
  await tempPool.end();
  
  const pool = new Pool(config.database);
  
  try {
    console.log('\nStep 2: Reading database schema...');
    const schema = fs.readFileSync('./setup_database.sql', 'utf8');
    
    console.log('Step 3: Creating tables and inserting sample data...');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (error) {
          // Ignore errors for statements that might already exist
          if (!error.message.includes('already exists') && 
              !error.message.includes('duplicate key')) {
            console.warn('⚠️ Warning:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Database schema created successfully!');
    
    console.log('\nStep 4: Verifying setup...');
    
    // Test queries
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const doors = await pool.query('SELECT COUNT(*) FROM doors');
    const activities = await pool.query('SELECT COUNT(*) FROM activities');
    
    console.log(`✅ Users table: ${users.rows[0].count} records`);
    console.log(`✅ Doors table: ${doors.rows[0].count} records`);
    console.log(`✅ Activities table: ${activities.rows[0].count} records`);
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('You can now start the server with: node server.js');
    
  } catch (error) {
    console.error('❌ Error setting up database schema:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure setup_database.sql exists');
    console.log('2. Check PostgreSQL permissions');
    console.log('3. Verify database connection');
  } finally {
    await pool.end();
  }
}

// Run setup
setupDatabase().catch(console.error);
