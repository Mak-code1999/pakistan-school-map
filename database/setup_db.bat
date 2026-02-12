@echo off
set "PG_BIN=C:\Program Files\PostgreSQL\16\bin"
set "DB_NAME=maktab_db"
set "DB_USER=postgres"

echo ==========================================
echo Maktab Database Setup
echo ==========================================
echo.
echo Step 1: Creating database '%DB_NAME%'...
echo (Please enter the password for user '%DB_USER%' if prompted)
"%PG_BIN%\createdb.exe" -U %DB_USER% %DB_NAME%

echo.
echo Step 2: initializing database with schema and data...
echo (Please enter the password for user '%DB_USER%' again if prompted)
"%PG_BIN%\psql.exe" -U %DB_USER% -d %DB_NAME% -f "init_database.sql"

echo.
echo ==========================================
echo Database setup complete!
echo ==========================================
pause
