"""
Test schools API to see the actual error
"""
import os
import sys
import django

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'maktab_project.settings')
django.setup()

from schools.models import School, District
from schools.serializers import SchoolSerializer

print("=" * 60)
print("TESTING SCHOOLS API")
print("=" * 60)

# Test 1: Check if schools exist
schools_count = School.objects.count()
print(f"\n✅ Total schools in database: {schools_count}")

# Test 2: Check if districts exist
districts_count = District.objects.count()
print(f"✅ Total districts in database: {districts_count}")

# Test 3: Try to get first school
try:
    school = School.objects.first()
    if school:
        print(f"\n✅ First school: {school.name}")
        print(f"   Category: {school.category}")
        print(f"   District: {school.district}")
        if school.district:
            print(f"   District name: {school.district.name_2}")
            print(f"   Province: {school.district.name_1}")
    else:
        print("\n❌ No schools found!")
except Exception as e:
    print(f"\n❌ Error getting school: {e}")

# Test 4: Try to serialize a school
try:
    school = School.objects.select_related('district').first()
    if school:
        serializer = SchoolSerializer(school)
        print(f"\n✅ Serialization successful!")
        print(f"   Data keys: {list(serializer.data.keys())}")
    else:
        print("\n❌ No school to serialize")
except Exception as e:
    print(f"\n❌ Serialization error: {e}")
    import traceback
    traceback.print_exc()

# Test 5: Try to get all schools with GeoJSON
try:
    from rest_framework_gis.serializers import GeoFeatureModelSerializer
    schools = School.objects.select_related('district').all()[:5]
    serializer = SchoolSerializer(schools, many=True)
    print(f"\n✅ Serialized {len(serializer.data['features'])} schools successfully!")
except Exception as e:
    print(f"\n❌ Error serializing schools: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
