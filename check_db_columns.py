"""
Check the actual columns in the Pak_District_Boundary table
"""
import os
import sys
import django

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'maktab_project.settings')
django.setup()

from django.db import connection

# Get table columns
with connection.cursor() as cursor:
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'Pak_District_Boundary'
        ORDER BY ordinal_position;
    """)
    
    print("=" * 60)
    print("Columns in 'Pak_District_Boundary' table:")
    print("=" * 60)
    
    columns = cursor.fetchall()
    if columns:
        for col_name, data_type in columns:
            print(f"  {col_name:30} {data_type}")
    else:
        print("  No columns found! Table might not exist or name is different.")
        
    print("\n" + "=" * 60)
    
    # Also check if table exists with different case
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name ILIKE '%district%boundary%'
        ORDER BY table_name;
    """)
    
    print("Tables matching 'district boundary':")
    print("=" * 60)
    
    tables = cursor.fetchall()
    for (table_name,) in tables:
        print(f"  {table_name}")
