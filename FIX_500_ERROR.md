# 🔧 FIXING THE 500 ERROR

## Problem:
```
GET http://127.0.0.1:8000/api/districts/ 500 (Internal Server Error)
GET http://127.0.0.1:8000/api/schools/ 500 (Internal Server Error)
```

## Root Cause:
The backend server is still running with the **old code** before we added new fields to the School model. Django needs to be restarted to load the new changes.

## ✅ SOLUTION:

### Step 1: Stop the Backend
In the backend terminal window, press **Ctrl+C** to stop the server.

### Step 2: Restart the Backend
```powershell
cd C:\Users\Lenovo\Desktop\Maktab\backend
.\venv\Scripts\activate
python manage.py runserver
```

### Step 3: Test the API
Open in your browser:
- http://127.0.0.1:8000/api/districts/
- http://127.0.0.1:8000/api/schools/

You should see JSON data, not an error page!

### Step 4: Refresh Your React App
Go back to http://localhost:3000 and refresh (Ctrl+R)

---

## 🎯 Quick Test Commands:

### Test if backend is working:
```powershell
# In PowerShell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/districts/" | ConvertTo-Json
```

### Or use Python:
```powershell
cd C:\Users\Lenovo\Desktop\Maktab
python test_api.py
```

---

## 📊 What Changed:

We added these fields to the School model:
- `num_students` (default: 0)
- `num_teachers` (default: 0)
- `num_classrooms` (default: 0)
- `establishment_year` (default: null)
- `has_library` (default: False)
- `has_computer_lab` (default: False)
- `has_playground` (default: False)

The migration already set default values, but Django needs to restart to use the new model definition.

---

## 🔍 If Still Not Working:

### Check Backend Terminal for Errors
After restarting, look for any error messages in red.

### Common Issues:

**1. Database Connection Error**
```
Solution: Make sure PostgreSQL is running
```

**2. Migration Not Applied**
```powershell
python manage.py migrate
```

**3. Import Error**
```
Solution: Check if all dependencies are installed
pip install -r requirements.txt
```

---

## ✅ Expected Result:

After restarting the backend, when you visit:
http://127.0.0.1:8000/api/schools/

You should see JSON like:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": 1,
        "name": "School Name",
        "category": "primary",
        "num_students": 0,
        "num_teachers": 0,
        ...
      },
      "geometry": {
        "type": "Point",
        "coordinates": [74.3587, 31.5204]
      }
    }
  ]
}
```

NOT an HTML error page starting with `<!DOCTYPE html>`

---

## 🚀 After Backend Restart:

Your React frontend will automatically:
1. ✅ Load the map
2. ✅ Show districts in dropdown
3. ✅ Display schools on map
4. ✅ Enable search functionality
5. ✅ Show 3D terrain

---

**RESTART THE BACKEND NOW!** That's all you need to do! 🎉
