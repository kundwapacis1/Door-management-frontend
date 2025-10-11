@echo off
echo Setting up PostgreSQL database for Door Management System...
echo.

echo Step 1: Creating database 'door_management'...
psql -U postgres -c "CREATE DATABASE door_management;" 2>nul
if %errorlevel% == 0 (
    echo ✅ Database 'door_management' created successfully!
) else (
    echo ⚠️ Database might already exist or there was an error
)

echo.
echo Step 2: Running database setup script...
psql -U postgres -d door_management -f setup_database.sql
if %errorlevel% == 0 (
    echo ✅ Database schema created successfully!
) else (
    echo ❌ Error running setup script
    echo Please check your PostgreSQL connection and credentials
)

echo.
echo Step 3: Testing database connection...
node test-connection.js

echo.
echo Setup complete! You can now start the server with: node server.js
pause
