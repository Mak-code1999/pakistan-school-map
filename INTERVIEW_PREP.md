# 🎓 Maktab Project - Interview Preparation Guide

This document explains **how** we built the project so far, so you can confidently explain it during your interview.

---

## 1. Database Architecture (PostgreSQL + PostGIS)

### **Concept:**
We are using **PostgreSQL** as our database because it is robust and open-source. For the mapping features, we added the **PostGIS extension**, which turns the database into a "Spatial Database".

### **What we did:**
- **Enabled PostGIS:** `CREATE EXTENSION postgis;`
  - *Why?* This allows us to store geometry data (like province boundaries and school locations) and run spatial queries (e.g., "Find all schools inside Punjab").
- **Schema Design:**
  - `Province` table: Stores MultiPolygons (complex shapes).
  - `School` table: Stores Points (latitude/longitude locations).
- **Manual SQL Init:** We ran `init_database.sql` to manually create these tables and insert 100 sample schools.

---

## 2. Backend Logic (Django REST Framework)

### **Concept:**
The backend is the "brain" of the application. It talks to the database and sends data to the frontend in JSON format.

### **The "GDAL" Issue we fixed:**
- **Problem:** Django's `GeoDjango` module needs low-level C++ libraries (GDAL/GEOS) to handle map data. On Windows, these are hard to find.
- **Solution:** We explicitly told Django where to find these libraries in `settings.py` by pointing it to your PostgreSQL installation (`C:\Program Files\PostgreSQL\16\bin`).
  - *Interview Tip:* If asked about challenges, mention "Configuring GDAL paths on Windows environment variables."

### **Migrations - The "Fake" Trick:**
- **Problem:** Django usually creates tables itself. But we created them manually using SQL first.
- **Solution:** We ran `python manage.py migrate --fake schools`.
  - *Why?* This tells Django, "Trust me, the tables already exist, just mark the migration as done." This synced Django with our existing database without errors.

---

## 3. Next Steps: Connecting the Pieces

Now we need to do two things to make the app "live":

1.  **Create a Superuser:**
    - *Command:* `python manage.py createsuperuser`
    - *Why?* This gives you a login for the Django Admin Panel (`/admin`), where you can easily view and edit database records (Provinces/Schools) without writing SQL.

2.  **Run the Server:**
    - *Command:* `python manage.py runserver`
    - *Why?* This starts a local web server at `http://127.0.0.1:8000`. It listens for requests (like "Get me all schools") and sends back data.

---

## 4. Frontend Architecture (React + Leaflet)

### **Concept:**
We built a responsive Single Page Application (SPA) using **React**. It consumes the API we built and visualizes it on a map.

### **Key Components:**
- **App.js:** The orchestrator. It fetches initial data (`/provinces`, `/schools`) and manages the global state (selected province, stats).
- **Map.jsx:** Wraps **React-Leaflet**. It handles:
  - Rendering GeoJSON layers (Districts, Schools).
  - "FlyTo" animations when a user selects a school.
  - click events to open the sidebar or add a new school.
- **Sidebar.jsx:** Displays the analytical dashboard.
  - **Dynamic Filtering:** Filters schools by province or search text.
  - **Charts:** Uses `Recharts` to show school category distribution.
- **DetailsDrawer.jsx:** A slide-out panel that shows *all* attributes of a school dynamically.
- **MapLegend.jsx:** A floating legend ensuring the map is readable.

### **Design System ("Deep Glass"):**
- We avoided basic Bootstrap looks.
- Created a **glassmorphism** effect (translucent dark backgrounds with blurs).
- **`theme.js`:** A single source of truth for our colors (Primary = Blue, Secondary = Purple). Changing one color here updates the Legend, Map Markers, and Charts instantly.

### **Challenges & Solutions:**
- **Challenge:** "Dark Mode Bleed" in dropdowns.
  - *Solution:* Browser default dropdowns look bad in dark mode. We wrote a custom CSS reset in `FormControls.css` to force dark backgrounds and white text.
- **Challenge:** Managing state between Map and Sidebar.
  - *Solution:* Lifted state up to `App.js`. When you click a school on the Map, it updates `selectedSchool` in App.js, which then passes that data down to `Sidebar` to highlight it.

---

## 5. Deployment & Delivery

### **Ready for Production:**
- **Backend:** Ready to be deployed on platforms like Railway or Render.
- **Frontend:** Can be deployed to Vercel/Netlify.
- **Data:** We are using PostgreSQL, so meaningful data persists.

### **Key Takeaway for Interview:**
"This isn't just a map; it's a scalable Full-Stack GIS architecture. It separates concerns (Backend API vs Frontend UI), uses standard geospatial libraries (PostGIS, Leaflet), and implements a professional design system."
