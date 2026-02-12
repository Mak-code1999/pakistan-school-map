"""
Test script to add a new school via POST request
"""
import requests
import json

# API endpoint
url = "http://127.0.0.1:8000/api/schools/"

# Test school data for different cities
test_schools = [
    {
        "name": "Test Primary School Lahore",
        "category": "primary",
        "longitude": 74.3587,
        "latitude": 31.5204
    },
    {
        "name": "Test Secondary School Karachi",
        "category": "secondary",
        "longitude": 67.0011,
        "latitude": 24.8607
    },
    {
        "name": "Test Higher Secondary Islamabad",
        "category": "higher_secondary",
        "longitude": 73.0479,
        "latitude": 33.6844
    }
]

print("=" * 60)
print("TESTING POST REQUEST - Adding New Schools")
print("=" * 60)

for i, school_data in enumerate(test_schools, 1):
    print(f"\n{i}. Testing: {school_data['name']}")
    print(f"   Location: ({school_data['latitude']}, {school_data['longitude']})")
    print(f"   Category: {school_data['category']}")
    
    try:
        response = requests.post(url, json=school_data)
        
        if response.status_code == 201:
            print(f"   ✅ SUCCESS! School created")
            data = response.json()
            if 'properties' in data:
                print(f"   School ID: {data['properties'].get('id', 'N/A')}")
                print(f"   District: {data['properties'].get('district_name', 'Auto-assigned')}")
        else:
            print(f"   ❌ FAILED! Status code: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    
    except Exception as e:
        print(f"   ❌ ERROR: {str(e)}")

print("\n" + "=" * 60)
print("POST TEST COMPLETE")
print("=" * 60)
print("\nTo verify:")
print("1. Open http://localhost:3000 in your browser")
print("2. Look for the new schools on the map")
print("3. Or check http://127.0.0.1:8000/api/schools/")
