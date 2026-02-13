
import os
import psycopg2
from urllib.parse import urlparse

def enable_postgis():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found, skipping PostGIS setup.")
        return

    print("Attempting to enable PostGIS extension...")
    try:
        # Connect to database
        connection = psycopg2.connect(db_url)
        connection.autocommit = True
        cursor = connection.cursor()
        
        # Run command
        cursor.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
        print("✅ SUCCESS: PostGIS extension enabled!")
        
        cursor.close()
        connection.close()
    except Exception as e:
        print(f"⚠️ Warning: Could not enable PostGIS. Error: {e}")
        print("Migration will attempt to proceed...")

if __name__ == "__main__":
    enable_postgis()
