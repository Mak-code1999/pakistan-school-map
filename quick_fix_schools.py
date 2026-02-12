"""
Quick script to update existing schools with default values for new fields
"""
import os
import sys
import django

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'maktab_project.settings')
django.setup()

from schools.models import School

print("Updating schools with default values...")

# Update all schools
updated = School.objects.all().update(
    num_students=0,
    num_teachers=0,
    num_classrooms=0,
    has_library=False,
    has_computer_lab=False,
    has_playground=False
)

print(f"✅ Updated {updated} schools with default values")
print("\nNow restart the backend server!")
