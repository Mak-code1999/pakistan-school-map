# Maktab Backend Setup Guide

## Prerequisites

- Python 3.10 or higher
- PostgreSQL 14+ with PostGIS extension
- pip (Python package manager)

## Step 1: Install PostgreSQL and PostGIS

### Windows:

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. During installation, make sure to install **Stack Builder**
5. After PostgreSQL installs, Stack Builder will open
6. Select your PostgreSQL installation and click Next
7. Under "Spatial Extensions", select **PostGIS**
8. Complete the PostGIS installation

## Step 2: Create Database

1. Open **pgAdmin** (installed with PostgreSQL)
2. Connect to your PostgreSQL server (use the password you set)
3. Right-click on "Databases" → "Create" → "Database"
4. Name it: `maktab_db`
5. Click "Save"

Alternatively, use command line:
```bash
psql -U postgres
CREATE DATABASE maktab_db;
\c maktab_db
CREATE EXTENSION postgis;
\q
```

## Step 3: Run Database Initialization Script

```bash
# Navigate to the database folder
cd C:\Users\Lenovo\Desktop\Maktab\database

# Run the SQL script
psql -U postgres -d maktab_db -f init_database.sql
```

You should see output confirming:
- 7 provinces created
- 100 schools created
- Spatial indexes created

## Step 4: Set Up Python Virtual Environment

```bash
# Navigate to backend folder
cd C:\Users\Lenovo\Desktop\Maktab\backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

## Step 5: Install Dependencies

```bash
# Make sure virtual environment is activated
pip install -r requirements.txt
```

This will install:
- Django 4.2
- Django REST Framework
- PostGIS adapter (psycopg2)
- CORS headers
- GeoJSON serializers

## Step 6: Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Open `.env` in a text editor and update:
```
DB_NAME=maktab_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_HOST=localhost
DB_PORT=5432

SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Replace `your_postgres_password_here` with your actual PostgreSQL password.

## Step 7: Run Django Migrations

```bash
# Make sure you're in the backend folder with venv activated
python manage.py migrate
```

This creates Django's internal tables.

## Step 8: Create Admin User (Optional)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

## Step 9: Start Development Server

```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

## Step 10: Test API Endpoints

Open your browser and visit:

- **All Provinces**: http://localhost:8000/api/provinces/
- **All Schools**: http://localhost:8000/api/schools/
- **Search Province**: http://localhost:8000/api/provinces/search/?q=Punjab
- **Province Stats**: http://localhost:8000/api/provinces/1/stats/

You should see GeoJSON responses.

## Troubleshooting

### Error: "django.core.exceptions.ImproperlyConfigured: Could not find the GDAL library"

**Solution**: PostGIS wasn't installed correctly. Reinstall PostgreSQL with PostGIS.

### Error: "psycopg2.OperationalError: FATAL: password authentication failed"

**Solution**: Check your `.env` file. Make sure `DB_PASSWORD` matches your PostgreSQL password.

### Error: "relation 'schools_province' does not exist"

**Solution**: Run the database initialization script again:
```bash
psql -U postgres -d maktab_db -f database/init_database.sql
```

## Running Tests

```bash
python manage.py test schools
```

All tests should pass.

## Next Steps

Once the backend is running, proceed to the frontend setup guide.
