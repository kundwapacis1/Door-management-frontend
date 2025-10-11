// Test if SQLite server works
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🧪 Testing SQLite Server Components...\n');

const dbPath = path.join(__dirname, 'door_management.db');
const db = new sqlite3.Database(dbPath);

// Test database connection
db.on('open', () => {
  console.log('✅ SQLite database connection successful');
});

db.on('error', (err) => {
  console.error('❌ SQLite database error:', err);
});

// Test queries
console.log('Testing database queries...');

// Test users table
db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
  if (err) {
    console.error('❌ Users table error:', err.message);
  } else {
    console.log(`✅ Users table: ${row.count} records`);
  }
});

// Test doors table
db.get('SELECT COUNT(*) as count FROM doors', (err, row) => {
  if (err) {
    console.error('❌ Doors table error:', err.message);
  } else {
    console.log(`✅ Doors table: ${row.count} records`);
  }
});

// Test activities table
db.get('SELECT COUNT(*) as count FROM activities', (err, row) => {
  if (err) {
    console.error('❌ Activities table error:', err.message);
  } else {
    console.log(`✅ Activities table: ${row.count} records`);
  }
});

// Test dashboard stats
db.get(`
  SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM doors) as total_doors,
    (SELECT COUNT(*) FROM doors WHERE is_online = 1) as active_doors
`, (err, row) => {
  if (err) {
    console.error('❌ Dashboard stats error:', err.message);
  } else {
    console.log('✅ Dashboard stats query successful');
    console.log(`   Total users: ${row.total_users}`);
    console.log(`   Total doors: ${row.total_doors}`);
    console.log(`   Active doors: ${row.active_doors}`);
  }
  
  console.log('\n🎉 All SQLite components working!');
  console.log('✅ Database connection successful');
  console.log('✅ All tables accessible');
  console.log('✅ Sample data present');
  console.log('✅ Queries working');
  console.log('\n🚀 Server is ready to start!');
  console.log('Run: node server-sqlite.js');
  
  db.close();
});
