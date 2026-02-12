# Maktab GIS - Testing Guide

## 🎯 How to Test Your Application

### 1. **Checking API Endpoints Manually**

#### Method 1: Using Your Browser (Easiest)
Simply open these URLs in your browser:

- **Districts API**: http://127.0.0.1:8000/api/districts/
- **Schools API**: http://127.0.0.1:8000/api/schools/
- **District Stats** (example): http://127.0.0.1:8000/api/districts/1/stats/

#### Method 2: Using PowerShell
```powershell
# Get all districts
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/districts/" -Method GET

# Get all schools
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/schools/" -Method GET

# Get stats for district ID 1
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/districts/1/stats/" -Method GET
```

#### Method 3: Using the Test Script
```powershell
cd C:\Users\Lenovo\Desktop\Maktab
python test_api.py
```

---

## 📊 Your Current Data

✅ **142 Districts** loaded in database
✅ **100 Schools** loaded in database

---

## 🆕 Testing POST (Adding New Schools)

### Method 1: Using the Frontend (Interactive)

1. **Open the application**: http://localhost:3000
2. **Click the "Point" tool** in the top-right corner of the map
3. **Click anywhere on the map** to place a school marker
4. **Fill out the form** that appears:
   - School Name
   - Category (Primary, Secondary, Higher Secondary, University)
5. **Click "Add School"**
6. **Verify**: The new school should appear on the map immediately!

### Method 2: Using PowerShell (API Testing)

```powershell
# Example: Add a new school in Lahore
$body = @{
    name = "Test School Lahore"
    category = "primary"
    longitude = 74.3587
    latitude = 31.5204
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/schools/" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Method 3: Using Python Script

Create a file `test_post_school.py`:

```python
import requests

# API endpoint
url = "http://127.0.0.1:8000/api/schools/"

# New school data
school_data = {
    "name": "Test High School",
    "category": "secondary",
    "longitude": 67.0011,  # Karachi
    "latitude": 24.8607
}

# Send POST request
response = requests.post(url, json=school_data)

if response.status_code == 201:
    print("✅ School created successfully!")
    print(f"Response: {response.json()}")
else:
    print(f"❌ Error: {response.status_code}")
    print(f"Response: {response.text}")
```

Run it:
```powershell
python test_post_school.py
```

---

## 🗺️ New 3D Features

### 1. **3D Terrain View**
- The map now loads with **3D satellite view**
- **Terrain elevation** is visible
- **Atmospheric sky** layer for realism

### 2. **3D/2D Toggle Button**
- Located at **bottom-left** of the map
- Click to switch between **2D (flat)** and **3D (tilted)** views
- Smooth animation transition

### 3. **District Extrusion**
- When you **click a district**, it **rises up** in 3D
- Creates a dramatic visual effect
- Makes it easy to see which district is selected

### 4. **Enhanced Search with Dropdown**
- **Province Filter**: Select a specific province to narrow down results
- **Live Search**: Type to see matching districts in real-time
- **Dropdown Menu**: Shows up to 10 matching districts
- **Click to Navigate**: Click any district to zoom and view stats

---

## 🎨 What's New in the Frontend

### Visual Improvements
✅ **3D Satellite Map** with terrain
✅ **Glassmorphism UI** throughout
✅ **Dropdown Search** with province filter
✅ **Improved Popups** with better formatting
✅ **3D District Highlighting** on selection
✅ **Smooth Animations** everywhere

### Functional Improvements
✅ **Province-based filtering** in search
✅ **Real-time search results** dropdown
✅ **3D/2D view toggle**
✅ **Better school markers** that scale with zoom
✅ **School labels** at high zoom levels
✅ **Enhanced statistics panel** with province info

---

## 🔍 How to Use the Application

### Step 1: View the Map
- Open http://localhost:3000
- You'll see Pakistan in **3D satellite view**
- **142 districts** with boundaries
- **100 schools** as colored markers

### Step 2: Search for a District
1. Use the **province dropdown** to filter by province
2. Type a **district name** in the search box
3. Click on a district from the **dropdown menu**
4. Map will **zoom and tilt** to that district in 3D
5. **Statistics panel** appears on the left

### Step 3: View School Statistics
- Click any **district boundary** on the map
- The district will **rise up in 3D**
- **Stats panel** shows:
  - Total schools in that district
  - Breakdown by category
  - Province information

### Step 4: Click on Schools
- Click any **colored marker** (school)
- **Popup** appears showing:
  - School name
  - Category
  - District

### Step 5: Add a New School
1. Click the **"Point" tool** (top-right)
2. Click **anywhere on the map**
3. **Form appears** - fill in:
   - School name
   - Category
4. Click **"Add School"**
5. New school appears **immediately**!

### Step 6: Toggle 3D View
- Click the **"3D/2D" button** (bottom-left)
- Map smoothly transitions between views
- Great for presentations!

---

## 📈 School Categories & Colors

| Category | Color | Hex Code |
|----------|-------|----------|
| 🔵 Primary | Blue | #4facfe |
| 🟣 Secondary | Pink | #f093fb |
| 🟡 Higher Secondary | Yellow | #ffd93d |
| 🔴 University | Red | #f5576c |

---

## 🚀 For Your Interview

### Highlight These Features:

1. **Full-Stack Development**
   - React frontend with modern UI
   - Django REST API backend
   - PostGIS spatial database

2. **GIS Expertise**
   - 3D terrain visualization
   - Spatial queries (districts containing schools)
   - Interactive mapping with Mapbox GL JS

3. **Modern Design**
   - Glassmorphism effects
   - Smooth animations
   - Responsive design

4. **Advanced Features**
   - Real-time search with dropdown
   - Province-based filtering
   - 3D district highlighting
   - CRUD operations (Create schools)

5. **User Experience**
   - Intuitive interface
   - Loading states
   - Error handling
   - Helpful tooltips

---

## 🐛 Troubleshooting

### Backend not loading?
```powershell
cd C:\Users\Lenovo\Desktop\Maktab\backend
.\venv\Scripts\activate
python manage.py runserver
```

### Frontend not loading?
```powershell
cd C:\Users\Lenovo\Desktop\Maktab\frontend
npm start
```

### Map not showing?
- Check your Mapbox token in `frontend/.env`
- Make sure you have internet connection (for map tiles)

### No data showing?
- Verify backend is running on port 8000
- Check browser console for errors (F12)
- Test API endpoints manually

---

## 📝 API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/districts/` | GET | Get all districts with boundaries |
| `/api/districts/{id}/` | GET | Get specific district |
| `/api/districts/{id}/stats/` | GET | Get district statistics |
| `/api/schools/` | GET | Get all schools |
| `/api/schools/` | POST | Create new school |
| `/api/schools/{id}/` | GET | Get specific school |
| `/api/schools/{id}/` | PUT/PATCH | Update school |
| `/api/schools/{id}/` | DELETE | Delete school |

---

**Good luck with your interview! 🎉**
