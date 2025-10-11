@echo off
echo Starting Door Management Backend Server...
echo.

echo Checking SQLite database...
node test-server.js

echo.
echo Starting server...
node server.js

pause
