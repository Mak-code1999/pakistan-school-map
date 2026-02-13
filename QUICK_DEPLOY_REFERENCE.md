# 🎯 **QUICK DEPLOYMENT REFERENCE**

## **BACKEND CONFIGURATION**

### **Build Command:**
```bash
./build.sh
```

### **Start Command:**
```bash
gunicorn maktab_project.wsgi:application
```

### **Environment Variables:**
```
PYTHON_VERSION=3.10.0
SECRET_KEY=<generate-at-djecrety.ir>
DATABASE_URL=<from-render-database>
DJANGO_SETTINGS_MODULE=maktab_project.settings_production
DEBUG=False
```

---

## **FRONTEND CONFIGURATION**

### **Build Command:**
```bash
npm install && npm run build
```

### **Publish Directory:**
```
build
```

### **Environment Variables:**
```
REACT_APP_API_URL=https://pakistan-school-map-api.onrender.com/api
```

---

## **TEST URLS**

### **Backend:**
```
https://pakistan-school-map-api.onrender.com/api/districts/
https://pakistan-school-map-api.onrender.com/api/schools/
https://pakistan-school-map-api.onrender.com/admin/
```

### **Frontend:**
```
https://pakistan-school-map.onrender.com
```

---

## **COMMON COMMANDS**

### **Create Superuser (in Render Shell):**
```bash
python manage.py createsuperuser
```

### **Collect Static Files:**
```bash
python manage.py collectstatic --no-input
```

### **Run Migrations:**
```bash
python manage.py migrate
```

### **Enable PostGIS (in psql):**
```sql
CREATE EXTENSION postgis;
SELECT PostGIS_version();
```

---

## **TROUBLESHOOTING**

| Issue | Solution |
|-------|----------|
| Backend won't start | Check DATABASE_URL and DJANGO_SETTINGS_MODULE |
| Frontend can't connect | Verify REACT_APP_API_URL and CORS settings |
| Database error | Ensure PostGIS extension is enabled |
| Static files 404 | Run collectstatic and check WhiteNoise |

---

**Follow:** `RENDER_DEPLOYMENT_CHECKLIST.md` for complete step-by-step guide
