"""
Script to populate schools with realistic data for analytics
"""
import os
import django
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'maktab_project.settings')
django.setup()

from schools.models import School

print("=" * 60)
print("POPULATING SCHOOLS WITH REALISTIC DATA")
print("=" * 60)

# Define realistic ranges for different school categories
CATEGORY_RANGES = {
    'primary': {
        'students': (50, 300),
        'teachers': (5, 20),
        'classrooms': (5, 15),
        'year_range': (1980, 2020)
    },
    'secondary': {
        'students': (200, 800),
        'teachers': (15, 50),
        'classrooms': (10, 30),
        'year_range': (1970, 2015)
    },
    'higher_secondary': {
        'students': (300, 1200),
        'teachers': (25, 80),
        'classrooms': (15, 40),
        'year_range': (1960, 2010)
    },
    'university': {
        'students': (1000, 10000),
        'teachers': (50, 500),
        'classrooms': (30, 150),
        'year_range': (1950, 2005)
    }
}

schools = School.objects.all()
total = schools.count()
updated = 0

print(f"\nFound {total} schools to update\n")

for school in schools:
    category = school.category
    ranges = CATEGORY_RANGES.get(category, CATEGORY_RANGES['primary'])
    
    # Generate realistic data
    school.num_students = random.randint(*ranges['students'])
    school.num_teachers = random.randint(*ranges['teachers'])
    school.num_classrooms = random.randint(*ranges['classrooms'])
    school.establishment_year = random.randint(*ranges['year_range'])
    
    # Facilities (higher chance for universities and higher secondary)
    if category in ['university', 'higher_secondary']:
        school.has_library = random.choice([True, True, True, False])  # 75% chance
        school.has_computer_lab = random.choice([True, True, True, False])
        school.has_playground = random.choice([True, True, False])  # 66% chance
    elif category == 'secondary':
        school.has_library = random.choice([True, True, False])  # 66% chance
        school.has_computer_lab = random.choice([True, False])  # 50% chance
        school.has_playground = random.choice([True, True, False])
    else:  # primary
        school.has_library = random.choice([True, False, False])  # 33% chance
        school.has_computer_lab = random.choice([False, False, True])  # 33% chance
        school.has_playground = random.choice([True, False])  # 50% chance
    
    school.save()
    updated += 1
    
    if updated % 10 == 0:
        print(f"Updated {updated}/{total} schools...")

print(f"\n✅ Successfully updated {updated} schools with realistic data!")
print("\nSample data:")
print("-" * 60)

# Show some examples
for category in ['primary', 'secondary', 'higher_secondary', 'university']:
    sample = School.objects.filter(category=category).first()
    if sample:
        print(f"\n{category.upper().replace('_', ' ')}:")
        print(f"  Name: {sample.name}")
        print(f"  Students: {sample.num_students}")
        print(f"  Teachers: {sample.num_teachers}")
        print(f"  Classrooms: {sample.num_classrooms}")
        print(f"  Established: {sample.establishment_year}")
        print(f"  Library: {'Yes' if sample.has_library else 'No'}")
        print(f"  Computer Lab: {'Yes' if sample.has_computer_lab else 'No'}")
        print(f"  Playground: {'Yes' if sample.has_playground else 'No'}")

print("\n" + "=" * 60)
print("DONE!")
print("=" * 60)
