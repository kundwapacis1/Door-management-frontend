# Manual PostgreSQL Setup Guide

## Step 1: Create Database

**Option A: Using psql command line**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE door_management;

# Exit
\q
```

**Option B: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases"
4. Select "Create" → "Database"
5. Name: `door_management`
6. Click "Save"

**Option C: Using Node.js script**
```bash
node setup-database.js
```

## Step 2: Run Setup Script

**Option A: Using psql**
```bash
psql -U postgres -d door_management -f setup_database.sql
```

**Option B: Using pgAdmin**
1. Connect to `door_management` database
2. Open Query Tool
3. Copy contents of `setup_database.sql`
4. Paste and execute

**Option C: Using Node.js script**
```bash
node setup-database.js
```

## Step 3: Test Connection

```bash
node test-connection.js
```

## Step 4: Start Server

```bash
node server.js
```

## Troubleshooting

### If you get authentication errors:

1. **Check PostgreSQL service is running:**
   - Windows: `services.msc` → Look for PostgreSQL service
   - Or: `net start postgresql-x64-14`

2. **Verify password in config.js:**
   ```javascript
   password: 'your_actual_password', // Update this
   ```

3. **Test with psql directly:**
   ```bash
   psql -U postgres -h localhost -p 5432
   ```

4. **Check PostgreSQL configuration:**
   - File: `postgresql.conf`
   - Look for: `listen_addresses = 'localhost'`
   - File: `pg_hba.conf`
   - Look for: `local all postgres md5`

### Common PostgreSQL passwords:
- `admin`
- `password`
- `postgres`
- `123456`
- (empty/blank)

### If database already exists:
The setup script will handle this gracefully and continue with table creation.

## Expected Output

### Successful setup:
```
🚀 Setting up PostgreSQL database for Door Management System...

Step 1: Creating database "door_management"...
✅ Database "door_management" created successfully!

Step 2: Reading database schema...
Step 3: Creating tables and inserting sample data...
✅ Database schema created successfully!

Step 4: Verifying setup...
✅ Users table: 3 records
✅ Doors table: 4 records
✅ Activities table: 3 records

🎉 Database setup completed successfully!
You can now start the server with: node server.js
```

### Successful server start:
```
🚀 Server running on port 3001
📡 WebSocket server ready for connections
🌐 HTTP API available at http://localhost:3001
🗄️ PostgreSQL database connected
```

## Next Steps

1. ✅ Database created
2. ✅ Tables and sample data inserted
3. ✅ Connection tested
4. 🔄 Start server
5. 🔄 Connect frontend

Your PostgreSQL backend is ready! 🎉
