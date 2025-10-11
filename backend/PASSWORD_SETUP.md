# PostgreSQL Password Setup Guide

## ✅ Status Check
- ✅ pg library installed and working
- ✅ PostgreSQL service running (postgresql-x64-17)
- ❌ Password authentication failing

## 🔍 Find Your PostgreSQL Password

### Method 1: Check pgAdmin
1. Open pgAdmin
2. Look at your server connection settings
3. Check the password field

### Method 2: Check Windows Credentials
1. Open Control Panel → Credential Manager
2. Look for PostgreSQL credentials
3. Check stored passwords

### Method 3: Reset Password
1. Open Command Prompt as Administrator
2. Navigate to PostgreSQL bin directory:
   ```cmd
   cd "C:\Program Files\PostgreSQL\17\bin"
   ```
3. Reset password:
   ```cmd
   psql -U postgres -c "ALTER USER postgres PASSWORD 'newpassword';"
   ```

### Method 4: Check Installation
1. Look for installation notes
2. Check if password was set during installation
3. Default might be what you set during setup

## 🛠️ Quick Fix Options

### Option 1: Try Common Passwords
Update `config.js` with these passwords one by one:
```javascript
password: 'your_actual_password', // Try these:
// 'postgres'
// 'admin' 
// 'password'
// '123456'
// 'root'
// 'user'
// 'test'
// '' (empty)
```

### Option 2: Reset to Known Password
1. Stop PostgreSQL service:
   ```cmd
   net stop postgresql-x64-17
   ```
2. Reset password (if you have access)
3. Start service:
   ```cmd
   net start postgresql-x64-17
   ```

### Option 3: Use Different User
Try connecting with a different user:
```javascript
user: 'your_username', // Instead of 'postgres'
```

## 🚀 Once Password is Found

1. Update `config.js` with correct password
2. Run setup: `node simple-setup.js`
3. Start server: `node server.js`

## 📞 Need Help?

If you can't find the password:
1. Check PostgreSQL installation documentation
2. Look for setup notes from installation
3. Try resetting PostgreSQL password
4. Contact your system administrator

## 🔧 Alternative: Use SQLite

If PostgreSQL is too complex, we can switch to SQLite:
```bash
npm install sqlite3
```

SQLite doesn't require password authentication and works immediately.

---

**Next Step**: Find your PostgreSQL password and update `config.js`, then run `node simple-setup.js`
