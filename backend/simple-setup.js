// Simple PostgreSQL setup without psql command
const { Pool } = require('pg');
const config = require('./config');

console.log('🚀 Simple PostgreSQL Setup (No psql required)');
console.log('==============================================\n');

async function simpleSetup() {
  let pool;
  
  try {
    console.log('Step 1: Testing PostgreSQL connection...');
    
    // Try to connect to postgres database first
    const tempConfig = {
      ...config.database,
      database: 'postgres' // Connect to default postgres database
    };
    
    pool = new Pool(tempConfig);
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    
    console.log('\nStep 2: Creating door_management database...');
    
    // Check if database exists
    const dbCheck = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'door_management'"
    );
    
    if (dbCheck.rows.length === 0) {
      // Create database
      await client.query('CREATE DATABASE door_management');
      console.log('✅ Database "door_management" created successfully!');
    } else {
      console.log('⚠️ Database "door_management" already exists');
    }
    
    client.release();
    await pool.end();
    
    console.log('\nStep 3: Connecting to door_management database...');
    
    // Now connect to the new database
    pool = new Pool(config.database);
    const newClient = await pool.connect();
    console.log('✅ Connected to door_management database!');
    
    console.log('\nStep 4: Creating tables...');
    
    // Create users table
    await newClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');
    
    // Create doors table
    await newClient.query(`
      CREATE TABLE IF NOT EXISTS doors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'closed' CHECK (status IN ('open', 'closed', 'locked')),
        is_online BOOLEAN DEFAULT true,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Doors table created');
    
    // Create activities table
    await newClient.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        door_id INTEGER REFERENCES doors(id),
        door_name VARCHAR(255) NOT NULL,
        action VARCHAR(50) NOT NULL CHECK (action IN ('entry', 'exit', 'denied')),
        method VARCHAR(50) NOT NULL CHECK (method IN ('pin', 'rfid', 'fingerprint', 'admin', 'system')),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Activities table created');
    
    console.log('\nStep 5: Inserting sample data...');
    
    // Insert sample users
    await newClient.query(`
      INSERT INTO users (name, email, role, password) VALUES
      ('John Doe', 'john@example.com', 'user', '$2b$10$example_hash_1'),
      ('Jane Smith', 'jane@example.com', 'user', '$2b$10$example_hash_2'),
      ('Admin User', 'admin@example.com', 'admin', '$2b$10$example_hash_3')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('✅ Sample users inserted');
    
    // Insert sample doors
    await newClient.query(`
      INSERT INTO doors (name, location, status, is_online) VALUES
      ('Main Entrance', 'Building A', 'closed', true),
      ('Side Door', 'Building B', 'open', true),
      ('Emergency Exit', 'Building C', 'locked', false),
      ('Back Door', 'Building D', 'closed', true)
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Sample doors inserted');
    
    // Insert sample activities
    await newClient.query(`
      INSERT INTO activities (user_id, user_name, door_id, door_name, action, method) VALUES
      ('user1', 'John Doe', 1, 'Main Entrance', 'entry', 'pin'),
      ('user2', 'Jane Smith', 2, 'Side Door', 'exit', 'rfid'),
      ('user3', 'Bob Wilson', 3, 'Emergency Exit', 'denied', 'pin')
      ON CONFLICT DO NOTHING
    `);
    console.log('✅ Sample activities inserted');
    
    console.log('\nStep 6: Creating indexes...');
    
    // Create indexes
    await newClient.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await newClient.query('CREATE INDEX IF NOT EXISTS idx_doors_status ON doors(status)');
    await newClient.query('CREATE INDEX IF NOT EXISTS idx_doors_online ON doors(is_online)');
    await newClient.query('CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp)');
    await newClient.query('CREATE INDEX IF NOT EXISTS idx_activities_door_id ON activities(door_id)');
    console.log('✅ Indexes created');
    
    console.log('\nStep 7: Creating dashboard stats view...');
    
    // Create dashboard stats view
    await newClient.query(`
      CREATE OR REPLACE VIEW dashboard_stats AS
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM doors) as total_doors,
        (SELECT COUNT(*) FROM doors WHERE is_online = true) as active_doors,
        (SELECT COUNT(*) FROM doors WHERE is_online = true) as online_doors,
        (SELECT COUNT(*) FROM doors WHERE is_online = false) as offline_doors,
        (SELECT COUNT(*) FROM activities WHERE timestamp > NOW() - INTERVAL '24 hours') as recent_activity
    `);
    console.log('✅ Dashboard stats view created');
    
    console.log('\nStep 8: Verifying setup...');
    
    // Verify data
    const userCount = await newClient.query('SELECT COUNT(*) FROM users');
    const doorCount = await newClient.query('SELECT COUNT(*) FROM doors');
    const activityCount = await newClient.query('SELECT COUNT(*) FROM activities');
    
    console.log(`✅ Users: ${userCount.rows[0].count} records`);
    console.log(`✅ Doors: ${doorCount.rows[0].count} records`);
    console.log(`✅ Activities: ${activityCount.rows[0].count} records`);
    
    newClient.release();
    await pool.end();
    
    console.log('\n🎉 PostgreSQL setup completed successfully!');
    console.log('✅ Database: door_management');
    console.log('✅ Tables: users, doors, activities');
    console.log('✅ Sample data inserted');
    console.log('✅ Indexes created');
    console.log('✅ Dashboard view created');
    console.log('\n🚀 You can now start the server with: node server.js');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your password in config.js');
    console.log('3. Verify PostgreSQL user has CREATE DATABASE privileges');
    console.log('4. Check if PostgreSQL is listening on port 5432');
    
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
}

// Run setup
simpleSetup();
