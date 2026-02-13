# 🚂 **RAILWAY.APP DEPLOYMENT GUIDE**

## **Why Railway?**

✅ **$5 free credit/month** (no card required initially)  
✅ **PostgreSQL + PostGIS support**  
✅ **Auto-deploy from GitHub**  
✅ **Similar to Render** (easy migration)  
✅ **Professional URLs**

---

## 📋 **DEPLOYMENT STEPS**

### **PHASE 1: CREATE RAILWAY ACCOUNT**

1. Go to: https://railway.app
2. Click **"Start a New Project"**
3. Click **"Login with GitHub"**
4. Authorize Railway

**✅ You get $5 free credit/month automatically!**

---

### **PHASE 2: DEPLOY DATABASE**

1. Click **"New Project"**
2. Click **"Provision PostgreSQL"**
3. Database will be created automatically
4. Click on the database service
5. Go to **"Variables"** tab
6. Copy the **`DATABASE_URL`** value

### **Enable PostGIS:**
1. Click on database service
2. Click **"Data"** tab
3. Click **"Query"** button
4. Run:
   ```sql
   CREATE EXTENSION postgis;
   SELECT PostGIS_version();
   ```

**✅ Database ready!**

---

### **PHASE 3: DEPLOY BACKEND**

1. Click **"New"** → **"GitHub Repo"**
2. Select **`pakistan-school-map`**
3. Click **"Add variables"**

**Environment Variables:**
```
PYTHON_VERSION=3.10.0
SECRET_KEY=<generate-at-djecrety.ir>
DATABASE_URL=${{Postgres.DATABASE_URL}}
DJANGO_SETTINGS_MODULE=maktab_project.settings_production
DEBUG=False
PORT=8000
```

4. Click **"Settings"** tab
5. **Root Directory:** `backend`
6. **Build Command:** `./build.sh`
7. **Start Command:** `gunicorn maktab_project.wsgi:application --bind 0.0.0.0:$PORT`

8. Click **"Deploy"**

**⏳ Wait 5-10 minutes**

**✅ Backend deployed!**

---

### **PHASE 4: DEPLOY FRONTEND**

1. Click **"New"** → **"GitHub Repo"**
2. Select **`pakistan-school-map`** again
3. Click **"Add variables"**

**Environment Variables:**
```
REACT_APP_API_URL=<your-backend-railway-url>/api
```

4. Click **"Settings"** tab
5. **Root Directory:** `frontend`
6. **Build Command:** `npm install && npm run build`
7. **Start Command:** `npx serve -s build -p $PORT`

8. Click **"Deploy"**

**⏳ Wait 3-5 minutes**

**✅ Frontend deployed!**

---

### **PHASE 5: GET YOUR URLS**

1. Click on backend service
2. Click **"Settings"** → **"Generate Domain"**
3. Copy the URL (e.g., `https://pakistan-school-map-api.up.railway.app`)

4. Click on frontend service
5. Click **"Settings"** → **"Generate Domain"**
6. Copy the URL (e.g., `https://pakistan-school-map.up.railway.app`)

**✅ Your app is live!**

---

## 💰 **FREE TIER LIMITS**

- **$5 credit/month** (enough for small projects)
- **500 hours execution time**
- **100GB bandwidth**
- **1GB storage**

**Estimated usage for your app:** ~$2-3/month (well within free tier!)

---

## 🎯 **ADVANTAGES OVER RENDER**

✅ No credit card required initially  
✅ $5 free credit/month  
✅ Simpler setup  
✅ Better free tier  
✅ Faster deployments

---

## 📧 **EMAIL TEMPLATE FOR CLIENT**

```
Subject: Pakistan School Map - Live Demo Ready

Dear [Client Name],

I'm excited to share the live demo of the Pakistan School Mapping Platform:

🌐 Live Application: https://pakistan-school-map.up.railway.app
📂 Source Code: https://github.com/Mak-code1999/pakistan-school-map
🔗 API: https://pakistan-school-map-api.up.railway.app/api/

The application is deployed on Railway.app's production infrastructure and is fully functional.

Features you can test:
✅ Interactive map with province boundaries
✅ Search and filter functionality
✅ Add new schools in real-time
✅ View statistics and charts
✅ Responsive design (mobile-friendly)

Technical Stack:
- Backend: Django 4.2 + PostgreSQL + PostGIS
- Frontend: React 18 + Leaflet
- Deployment: Railway.app
- API: RESTful with GeoJSON

Feel free to test all features and share with your team!

Looking forward to our interview on February 16th!

Best regards,
Mahrkh Iftikhar
```

---

## ✅ **DEPLOYMENT CHECKLIST**

- [ ] Railway account created
- [ ] PostgreSQL database provisioned
- [ ] PostGIS extension enabled
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Domains generated
- [ ] App tested
- [ ] Email sent to client

---

**Estimated time:** 20-30 minutes  
**Cost:** $0 (free tier)  
**Difficulty:** Easy!

---

**Railway is actually EASIER than Render!** 🚀
