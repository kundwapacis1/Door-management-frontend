# PostgreSQL Backend Setup Guide

## Problem Solved: Missing 'pg' Module

The error `Cannot find module 'pg'` has been resolved by:
1. ✅ Installing all required dependencies
2. ✅ Updating server.js to use config.js instead of .env
3. ✅ Creating proper database configuration

## Quick Setup Steps

### 1. Install Dependencies (Already Done)
```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database

**Step 2a: Create Database**
```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE door_management;

# Exit psql
\q
```

**Step 2b: Run Setup Script**
```bash
# Run the database setup script
psql -U postgres -d door_management -f setup_database.sql
```

### 3. Configure Database Connection

**Update `config.js` with your PostgreSQL credentials:**
```javascript
database: {
  host: 'localhost',
  port: 5432,
  database: 'door_management',
  user: 'postgres',
  password: 'your_actual_password', // Change this!
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}
```

### 4. Test Connection
```bash
# Test database connection
node test-connection.js
```

### 5. Start Server
```bash
# Start the backend server
node server.js
```

## Expected Output

### Successful Connection:
```
Testing PostgreSQL connection...
✅ Successfully connected to PostgreSQL database
✅ Query successful: { now: '2024-01-15T10:30:00.000Z' }
```

### Server Startup:
```
🚀 Server running on port 3001
📡 WebSocket server ready for connections
🌐 HTTP API available at http://localhost:3001
🗄️ PostgreSQL database connected
```

## Troubleshooting

### If you get connection errors:

1. **Check PostgreSQL is running:**
   ```bash
   # Windows
   services.msc
   # Look for "postgresql" service and start it
   
   # Or command line
   net start postgresql-x64-14
   ```

2. **Verify database exists:**
   ```bash
   psql -U postgres -l
   # Should show "door_management" in the list
   ```

3. **Check credentials:**
   - Default username: `postgres`
   - Default password: (whatever you set during installation)
   - Update `config.js` with correct password

4. **Test with psql directly:**
   ```bash
   psql -U postgres -d door_management
   # Should connect successfully
   ```

## Database Schema

The setup script creates:
- **users** table (id, name, email, role, password)
- **doors** table (id, name, location, status, is_online)
- **activities** table (id, user_id, user_name, door_id, door_name, action, method)
- **dashboard_stats** view (aggregated statistics)

## Sample Data

The setup script inserts:
- 3 sample users (including admin@example.com)
- 4 sample doors (different locations)
- 3 sample activities

## Next Steps

1. ✅ Dependencies installed
2. ✅ Database schema created
3. ✅ Server configuration updated
4. 🔄 Test connection
5. 🔄 Start server
6. 🔄 Connect frontend

## API Endpoints Available

- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `GET /api/doors` - List all doors
- `POST /api/doors` - Create door
- `POST /api/doors/:id/control` - Control door
- `GET /api/dashboard/stats` - Dashboard statistics

## WebSocket Events

- `door_status_update` - Real-time door status
- `dashboard_stats` - Live statistics
- `user_activity` - Activity logs

Your PostgreSQL backend is now ready! 🎉
