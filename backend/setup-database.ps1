# PowerShell script to setup PostgreSQL database
Write-Host "Setting up PostgreSQL database for Door Management System..." -ForegroundColor Green
Write-Host ""

# Step 1: Create database
Write-Host "Step 1: Creating database 'door_management'..." -ForegroundColor Yellow
try {
    psql -U postgres -c "CREATE DATABASE door_management;" 2>$null
    Write-Host "✅ Database 'door_management' created successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Database might already exist or there was an error" -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Run setup script
Write-Host "Step 2: Running database setup script..." -ForegroundColor Yellow
try {
    psql -U postgres -d door_management -f setup_database.sql
    Write-Host "✅ Database schema created successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error running setup script" -ForegroundColor Red
    Write-Host "Please check your PostgreSQL connection and credentials" -ForegroundColor Red
}

Write-Host ""

# Step 3: Test connection
Write-Host "Step 3: Testing database connection..." -ForegroundColor Yellow
node test-connection.js

Write-Host ""
Write-Host "Setup complete! You can now start the server with: node server.js" -ForegroundColor Green
Read-Host "Press Enter to continue"
