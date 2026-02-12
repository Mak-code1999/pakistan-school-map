"""
Simple script to test Maktab API endpoints
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_districts():
    print("\n=== Testing Districts Endpoint ===")
    try:
        response = requests.get(f"{BASE_URL}/districts/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: Found {len(data.get('features', []))} districts")
            if data.get('features'):
                print(f"   Sample district: {data['features'][0]['properties'].get('name', 'N/A')}")
            return True
        else:
            print(f"❌ ERROR: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def test_schools():
    print("\n=== Testing Schools Endpoint ===")
    try:
        response = requests.get(f"{BASE_URL}/schools/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: Found {len(data.get('features', []))} schools")
            if data.get('features'):
                school = data['features'][0]['properties']
                print(f"   Sample school: {school.get('name', 'N/A')} ({school.get('category', 'N/A')})")
            return True
        else:
            print(f"❌ ERROR: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def test_district_stats(district_id=1):
    print(f"\n=== Testing District Stats Endpoint (ID: {district_id}) ===")
    try:
        response = requests.get(f"{BASE_URL}/districts/{district_id}/stats/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS: District stats retrieved")
            print(f"   District: {data.get('district_name', 'N/A')}")
            print(f"   Province: {data.get('province_name', 'N/A')}")
            print(f"   Total Schools: {data.get('total_schools', 0)}")
            print(f"   By Category: {data.get('schools_by_category', {})}")
            return True
        else:
            print(f"❌ ERROR: Status code {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("MAKTAB GIS API ENDPOINT TESTS")
    print("=" * 50)
    
    results = []
    results.append(("Districts", test_districts()))
    results.append(("Schools", test_schools()))
    results.append(("District Stats", test_district_stats()))
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    for name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{name}: {status}")
    
    all_passed = all(result[1] for result in results)
    if all_passed:
        print("\n🎉 All tests passed! Your API is working correctly!")
    else:
        print("\n⚠️ Some tests failed. Check the errors above.")
