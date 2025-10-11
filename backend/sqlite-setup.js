// SQLite setup as alternative to PostgreSQL
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🚀 Setting up SQLite database (No password required)');
console.log('==================================================\n');

const dbPath = path.join(__dirname, 'door_management.db');
const db = new sqlite3.Database(dbPath);

async function setupSQLite() {
  return new Promise((resolve, reject) => {
    console.log('Step 1: Creating SQLite database...');
    
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
        reject(err);
        return;
      }
      console.log('✅ Users table created');
    });
    
    // Create doors table
    db.run(`
      CREATE TABLE IF NOT EXISTS doors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT DEFAULT 'closed' CHECK (status IN ('open', 'closed', 'locked')),
        is_online BOOLEAN DEFAULT 1,
        last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating doors table:', err);
        reject(err);
        return;
      }
      console.log('✅ Doors table created');
    });
    
    // Create activities table
    db.run(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        door_id INTEGER REFERENCES doors(id),
        door_name TEXT NOT NULL,
        action TEXT NOT NULL CHECK (action IN ('entry', 'exit', 'denied')),
        method TEXT NOT NULL CHECK (method IN ('pin', 'rfid', 'fingerprint', 'admin', 'system')),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating activities table:', err);
        reject(err);
        return;
      }
      console.log('✅ Activities table created');
    });
    
    console.log('\nStep 2: Inserting sample data...');
    
    // Insert sample users
    db.run(`
      INSERT OR IGNORE INTO users (name, email, role, password) VALUES
      ('John Doe', 'john@example.com', 'user', '$2b$10$example_hash_1'),
      ('Jane Smith', 'jane@example.com', 'user', '$2b$10$example_hash_2'),
      ('Admin User', 'admin@example.com', 'admin', '$2b$10$example_hash_3')
    `, (err) => {
      if (err) {
        console.error('Error inserting users:', err);
        reject(err);
        return;
      }
      console.log('✅ Sample users inserted');
    });
    
    // Insert sample doors
    db.run(`
      INSERT OR IGNORE INTO doors (name, location, status, is_online) VALUES
      ('Main Entrance', 'Building A', 'closed', 1),
      ('Side Door', 'Building B', 'open', 1),
      ('Emergency Exit', 'Building C', 'locked', 0),
      ('Back Door', 'Building D', 'closed', 1)
    `, (err) => {
      if (err) {
        console.error('Error inserting doors:', err);
        reject(err);
        return;
      }
      console.log('✅ Sample doors inserted');
    });
    
    // Insert sample activities
    db.run(`
      INSERT OR IGNORE INTO activities (user_id, user_name, door_id, door_name, action, method) VALUES
      ('user1', 'John Doe', 1, 'Main Entrance', 'entry', 'pin'),
      ('user2', 'Jane Smith', 2, 'Side Door', 'exit', 'rfid'),
      ('user3', 'Bob Wilson', 3, 'Emergency Exit', 'denied', 'pin')
    `, (err) => {
      if (err) {
        console.error('Error inserting activities:', err);
        reject(err);
        return;
      }
      console.log('✅ Sample activities inserted');
    });
    
    console.log('\nStep 3: Creating indexes...');
    
    // Create indexes
    db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)', (err) => {
      if (err) console.error('Error creating users index:', err);
    });
    
    db.run('CREATE INDEX IF NOT EXISTS idx_doors_status ON doors(status)', (err) => {
      if (err) console.error('Error creating doors status index:', err);
    });
    
    db.run('CREATE INDEX IF NOT EXISTS idx_doors_online ON doors(is_online)', (err) => {
      if (err) console.error('Error creating doors online index:', err);
    });
    
    db.run('CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp)', (err) => {
      if (err) console.error('Error creating activities timestamp index:', err);
    });
    
    db.run('CREATE INDEX IF NOT EXISTS idx_activities_door_id ON activities(door_id)', (err) => {
      if (err) console.error('Error creating activities door_id index:', err);
    });
    
    console.log('✅ Indexes created');
    
    console.log('\nStep 4: Verifying setup...');
    
    // Verify data
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        console.error('Error counting users:', err);
        reject(err);
        return;
      }
      console.log(`✅ Users: ${row.count} records`);
    });
    
    db.get('SELECT COUNT(*) as count FROM doors', (err, row) => {
      if (err) {
        console.error('Error counting doors:', err);
        reject(err);
        return;
      }
      console.log(`✅ Doors: ${row.count} records`);
    });
    
    db.get('SELECT COUNT(*) as count FROM activities', (err, row) => {
      if (err) {
        console.error('Error counting activities:', err);
        reject(err);
        return;
      }
      console.log(`✅ Activities: ${row.count} records`);
      
      console.log('\n🎉 SQLite setup completed successfully!');
      console.log('✅ Database: door_management.db');
      console.log('✅ Tables: users, doors, activities');
      console.log('✅ Sample data inserted');
      console.log('✅ Indexes created');
      console.log('\n🚀 You can now start the server with: node server.js');
      
      db.close();
      resolve();
    });
  });
}

setupSQLite().catch(console.error);
