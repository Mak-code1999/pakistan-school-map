# 🚀 **RENDER DEPLOYMENT - STEP-BY-STEP CHECKLIST**

**Date:** February 13, 2026  
**Estimated Time:** 30-40 minutes  
**Status:** Ready to Deploy ✅

---

## ✅ **PHASE 1: PREPARE CODE (COMPLETE!)**

- [x] ✅ Created `settings_production.py`
- [x] ✅ Created `build.sh` script
- [x] ✅ Updated `requirements.txt` with production dependencies
- [x] ✅ Added WhiteNoise middleware
- [x] ✅ Pushed to GitHub

---

## 📋 **PHASE 2: CREATE RENDER ACCOUNT (2 minutes)**

### **Step 1: Sign Up**
1. Open browser: https://render.com
2. Click **"Get Started for Free"**
3. Click **"Sign up with GitHub"** (recommended)
4. Authorize Render to access your repositories
5. Complete account setup

**✅ Checkpoint:** You should see the Render dashboard

---

## 🗄️ **PHASE 3: CREATE POSTGRESQL DATABASE (5 minutes)**

### **Step 1: Create Database**
1. In Render dashboard, click **"New +"** (top right)
2. Select **"PostgreSQL"**
3. Fill in details:
   - **Name:** `pakistan-school-map-db`
   - **Database:** `maktab_db`
   - **User:** `maktab_user` (auto-filled)
   - **Region:** Choose closest to you (e.g., Singapore, Frankfurt)
   - **PostgreSQL Version:** 16 (latest)
   - **Plan:** **Free**
4. Click **"Create Database"**

**⏳ Wait:** 2-3 minutes for database to provision

### **Step 2: Copy Database URL**
1. Once database is ready, click on it
2. Scroll down to **"Connections"** section
3. Copy the **"Internal Database URL"**
   - It looks like: `postgresql://maktab_user:xxxxx@dpg-xxxxx/maktab_db`
4. **SAVE THIS URL** - you'll need it for backend!

### **Step 3: Enable PostGIS Extension**
1. In database dashboard, scroll to **"Info"** section
2. Click **"Connect"** button
3. Copy the **"PSQL Command"**
4. Open your PowerShell and paste the command
5. When connected, run:
   ```sql
   CREATE EXTENSION postgis;
   SELECT PostGIS_version();
   \q
   ```

**✅ Checkpoint:** You should see PostGIS version (e.g., "3.4")

---

## 🔧 **PHASE 4: DEPLOY BACKEND (10 minutes)**

### **Step 1: Create Web Service**
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Find and select: **`pakistan-school-map`**
4. Click **"Connect"**

### **Step 2: Configure Service**
Fill in these details:

| Field | Value |
|-------|-------|
| **Name** | `pakistan-school-map-api` |
| **Region** | Same as database (important!) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `./build.sh` |
| **Start Command** | `gunicorn maktab_project.wsgi:application` |
| **Plan** | **Free** |

### **Step 3: Add Environment Variables**
Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.10.0` |
| `SECRET_KEY` | (Generate random string - see below) |
| `DATABASE_URL` | (Paste Internal Database URL from Phase 3) |
| `DJANGO_SETTINGS_MODULE` | `maktab_project.settings_production` |
| `DEBUG` | `False` |

**To generate SECRET_KEY:**
- Go to: https://djecrety.ir/
- Copy the generated key
- Paste as SECRET_KEY value

### **Step 4: Deploy**
1. Click **"Create Web Service"**
2. **⏳ Wait:** 5-10 minutes for deployment

**Watch the logs** - you should see:
```
Installing dependencies...
Collecting static files...
Running migrations...
Build complete!
```

### **Step 5: Verify Backend**
1. Once deployed, copy your backend URL (e.g., `https://pakistan-school-map-api.onrender.com`)
2. Test in browser:
   ```
   https://pakistan-school-map-api.onrender.com/api/districts/
   https://pakistan-school-map-api.onrender.com/api/schools/
   ```
3. You should see `[]` (empty arrays) - that's OK! We'll load data later.

**✅ Checkpoint:** Backend API is responding

---

## 🎨 **PHASE 5: DEPLOY FRONTEND (5 minutes)**

### **Step 1: Create Static Site**
1. Click **"New +"** → **"Static Site"**
2. Select your repository: **`pakistan-school-map`**
3. Click **"Connect"**

### **Step 2: Configure Static Site**
Fill in these details:

| Field | Value |
|-------|-------|
| **Name** | `pakistan-school-map` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

### **Step 3: Add Environment Variable**
Click **"Advanced"** → **"Add Environment Variable"**

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://pakistan-school-map-api.onrender.com/api` |

**⚠️ IMPORTANT:** Replace with YOUR actual backend URL!

### **Step 4: Deploy**
1. Click **"Create Static Site"**
2. **⏳ Wait:** 3-5 minutes for deployment

**Watch the logs** - you should see:
```
npm install
npm run build
Build complete!
```

### **Step 5: Verify Frontend**
1. Once deployed, you'll get a URL like: `https://pakistan-school-map.onrender.com`
2. Open it in browser
3. You should see your map!

**✅ Checkpoint:** Map loads (might be empty - that's OK!)

---

## 🗺️ **PHASE 6: LOAD INITIAL DATA (5 minutes)**

### **Option A: Using Django Admin (Recommended)**
1. Go to your backend URL: `https://pakistan-school-map-api.onrender.com/admin`
2. Create superuser first:
   - In Render backend dashboard, click **"Shell"**
   - Run:
     ```bash
     python manage.py createsuperuser
     ```
   - Enter username, email, password
3. Login to admin panel
4. Add districts and schools manually

### **Option B: Load from Shapefile (Advanced)**
1. In Render backend dashboard, click **"Shell"**
2. Upload your shapefile (if you have it)
3. Run Django management command to load data

### **Option C: Add Sample Data via API**
Use Postman or curl to POST to:
```
https://pakistan-school-map-api.onrender.com/api/schools/
```

**For now, you can skip this and add data through the frontend!**

---

## ✅ **PHASE 7: TEST & VERIFY (5 minutes)**

### **Test Checklist:**

- [ ] Frontend loads: `https://pakistan-school-map.onrender.com`
- [ ] Map displays correctly
- [ ] Backend API works: `/api/districts/` and `/api/schools/`
- [ ] Can add a school through the frontend
- [ ] School appears on map
- [ ] Province filter works
- [ ] Statistics display correctly

**If everything works:** 🎉 **DEPLOYMENT SUCCESSFUL!**

---

## 📧 **PHASE 8: SHARE WITH CLIENT (2 minutes)**

### **Email Template:**

```
Subject: Pakistan School Map - Live Demo Ready for Review

Dear [Client Name],

I'm excited to share the live demo of the Pakistan School Mapping Platform:

🌐 Live Application: https://pakistan-school-map.onrender.com
📂 Source Code: https://github.com/Mak-code1999/pakistan-school-map
🔗 API Documentation: https://pakistan-school-map-api.onrender.com/api/

Features you can test:
✅ Interactive map of Pakistan with province boundaries
✅ Search and filter by province
✅ View school statistics with interactive charts
✅ Add new schools (click "Add School" button)
✅ View detailed school information
✅ Responsive design (works on mobile)

Technical Stack:
- Backend: Django 4.2 + PostgreSQL + PostGIS
- Frontend: React 18 + Leaflet
- Deployment: Render.com (production environment)
- API: RESTful with GeoJSON format

The application is fully functional and ready for testing. Feel free to:
- Add test schools to see real-time updates
- Share the link with your team
- Test on different devices

Note: This is deployed on a free tier, so the first load might take 30 seconds (cold start). Subsequent loads will be instant.

I'm looking forward to discussing this project and my approach during our interview on February 16th!

Best regards,
Mahrkh Iftikhar

GitHub: https://github.com/Mak-code1999
LinkedIn: [Your LinkedIn]
Email: [Your Email]
```

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Backend won't start**
**Solution:**
1. Check logs in Render dashboard
2. Verify `DATABASE_URL` is set correctly
3. Ensure `DJANGO_SETTINGS_MODULE` is `maktab_project.settings_production`

### **Issue: Frontend shows "Cannot connect to API"**
**Solution:**
1. Check `REACT_APP_API_URL` is correct
2. Verify backend is running
3. Check browser console for CORS errors
4. Ensure backend CORS settings include frontend URL

### **Issue: Database connection fails**
**Solution:**
1. Use **Internal Database URL**, not External
2. Verify database and backend are in same region
3. Check PostGIS extension is enabled

### **Issue: Static files not loading**
**Solution:**
1. Run `python manage.py collectstatic` in Shell
2. Verify WhiteNoise is in MIDDLEWARE
3. Check `STATIC_ROOT` is set in settings

---

## 📊 **DEPLOYMENT SUMMARY**

### **Your URLs:**
- **Frontend:** `https://pakistan-school-map.onrender.com`
- **Backend API:** `https://pakistan-school-map-api.onrender.com/api/`
- **Admin Panel:** `https://pakistan-school-map-api.onrender.com/admin/`

### **Free Tier Limits:**
- PostgreSQL: 1GB storage, 90 days retention
- Backend: 750 hours/month, 512MB RAM
- Frontend: 100GB bandwidth/month
- **Cost: $0/month**

### **Auto-Deployment:**
Every time you push to GitHub:
1. Render detects the change
2. Automatically rebuilds
3. Deploys new version
4. **Updates are live in 2-3 minutes!**

---

## 🎯 **NEXT STEPS**

1. **Complete deployment** following this checklist
2. **Test all features** thoroughly
3. **Send email to client** with live URL
4. **Prepare for interview:**
   - Read `INTERVIEW_PREP.md`
   - Practice demo
   - Be ready to discuss architecture

---

## ✅ **FINAL CHECKLIST**

- [ ] Render account created
- [ ] PostgreSQL database created
- [ ] PostGIS extension enabled
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Backend API tested
- [ ] Frontend tested
- [ ] Sample data added
- [ ] Email sent to client
- [ ] Ready for interview!

---

**Good luck with deployment! Follow each phase carefully and you'll be live in 30 minutes!** 🚀

**Need help? Check the troubleshooting section or refer to `DEPLOYMENT_GUIDE.md`**
